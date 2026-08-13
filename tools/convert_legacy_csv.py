"""Convert the DEWA service-catalog CSV export into the normalised workbook format."""

import re
import sys
from collections import OrderedDict

import pandas as pd

SRC = sys.argv[1] if len(sys.argv) > 1 else (
    '/home/ubuntu/attachments/08f18d40-7e67-4399-bf2a-d47c20ecce51/test.csv'
)
OUT = sys.argv[2] if len(sys.argv) > 2 else '/home/ubuntu/service-catalog-converted.xlsx'

ENTITLEMENT_NOTE_RE = re.compile(
    r'The following Entitlement Groups should have access.*$', re.IGNORECASE | re.DOTALL
)
BULLET_RE = re.compile(r'(?:^|\s)\*\s*(?=\S)')
SLA_RE = re.compile(
    r'(\d+(?:\.\d+)?)\s*(WD|WORKING DAYS?|WEEKS?|DAYS?|HRS?|HOURS?)\b', re.IGNORECASE
)
STEP_RE = re.compile(r'(?:^|\s)(\d{1,2})[\.\)]\s+')
ROLE_WORDS = ('direct manager', 'department manager', 'division manager', 'md & ceo')

UNIT_MAP = {
    'wd': 'WD',
    'working day': 'WD',
    'working days': 'WD',
    'week': 'WEEKS',
    'weeks': 'WEEKS',
    'day': 'DAYS',
    'days': 'DAYS',
    'hr': 'HOURS',
    'hrs': 'HOURS',
    'hour': 'HOURS',
    'hours': 'HOURS',
}


def clean(text):
    return re.sub(r'\s+', ' ', str(text).replace('\xa0', ' ')).strip()


def key(text):
    return re.sub(r'[^a-z0-9]+', '', clean(text).lower())


def slug(text, limit=28):
    out = re.sub(r'[^A-Za-z0-9]+', '-', clean(text)).strip('-').upper()
    return out[:limit].strip('-') or 'ITEM'


def split_bullets(text):
    """Return OrderedDict{name: value} for '* Name : value' lists, else {} ."""
    raw = clean(text)
    if raw.count('*') < 2:
        return OrderedDict()
    parts = [part for part in BULLET_RE.split(raw) if clean(part)]
    if len(parts) < 3:
        return OrderedDict()
    items = OrderedDict()
    for part in parts[1:] if not raw.lstrip().startswith('*') else parts:
        piece = clean(part)
        separator = r':' if ':' in piece else r'\s-\s'
        match = re.match(rf'(.{{2,90}}?)\s*(?:{separator})\s*(.*)$', piece, re.DOTALL)
        if not match:
            continue
        name, value = clean(match.group(1)), clean(match.group(2))
        if name and name not in items:
            items[name] = value
    return items


def parse_sla(text):
    raw = clean(text)
    if not raw or 'no sla' in raw.lower():
        return None
    match = SLA_RE.search(raw)
    if not match:
        return None
    unit = UNIT_MAP.get(match.group(2).lower(), match.group(2).upper())
    return float(match.group(1)), unit


def parse_ticket_type(text):
    raw = clean(text).upper()
    if 'BUSINESS CASE' in raw or raw.startswith('CASE'):
        return 'CASE'
    if 'INC' in raw:
        return 'INC'
    if 'WO' in raw:
        return 'WO'
    if 'NO FULFILLMENT' in raw or 'NOT APPLICABLE' in raw:
        return ''
    return 'WO' if raw else ''


def parse_approvals(text):
    """Free-text approval chain -> [(approver_type, approver)] in level order."""
    raw = clean(text)
    if not raw or raw.lower().startswith('no approval'):
        return []
    raw = re.split(r'\bNote\s*:', raw)[0]
    if '>' in raw:
        steps = [clean(step) for step in raw.split('>')]
    else:
        steps = [clean(step) for step in STEP_RE.split(raw)[::2]] if STEP_RE.search(raw) else [raw]
    levels = []
    for step in steps:
        step = re.sub(r'^\d{1,2}[\.\)]\s*', '', clean(step))
        if not step or step.lower() in ('no approval', 'na'):
            continue
        group = re.search(r'Support Group Name\s*:\s*([^()]+)', step, re.IGNORECASE)
        if group:
            levels.append(('GROUP', clean(group.group(1))))
            continue
        custom = re.match(r'Custom\s*:\s*(.+)', step, re.IGNORECASE)
        if custom:
            levels.append(('CUSTOM', clean(custom.group(1))[:120]))
            continue
        lowered = step.lower()
        if any(word in lowered for word in ROLE_WORDS):
            role = next(word for word in ROLE_WORDS if word in lowered)
            levels.append(('ROLE', role.title()))
            continue
        levels.append(('PERSON', step[:120]))
    return levels


def parse_support_groups(text):
    """Support-group text -> ([groups], execution_mode)."""
    raw = clean(text)
    if not raw or raw.lower() in ('not applicable', 'na', 'nil'):
        return [], 'PARALLEL'
    if STEP_RE.search(raw):
        steps = [clean(step) for step in STEP_RE.split(raw)[::2] if clean(step)]
        steps = [re.sub(r'^\d{1,2}[\.\)]\s*', '', step) for step in steps]
        steps = [step for step in steps if step]
        if len(steps) > 1:
            return [step[:120] for step in steps], 'SEQUENCE'
    if 'as per input' in raw.lower() or '=' in raw:
        return [raw[:160]], 'PARALLEL'
    groups = [clean(part) for part in re.split(r'[;&]| and ', raw) if clean(part)]
    return [group[:120] for group in groups] or [raw[:120]], 'PARALLEL'


def main():
    frame = pd.read_csv(SRC, dtype=str, encoding='cp1252').fillna('')
    frame = frame.map(lambda value: clean(value))

    services, sub_services, entitlements, slas = [], [], [], []
    approvals, assignments, attributes = [], [], []
    support_groups = OrderedDict()
    used_ids = set()

    for _, row in frame.iterrows():
        service_name = row['New Service Name']
        if not service_name:
            continue
        service_id = slug(service_name)
        while service_id in used_ids:
            service_id = f'{service_id[:24]}-{len(used_ids)}'
        used_ids.add(service_id)

        services.append([
            service_id,
            service_name,
            row['Operational Categoy 1'] or 'Request',
            '', '', '',
            row['Old Service Name'],
        ])

        for column, label in (
            ('Operational Categoy 2', 'operational_category_2'),
            ('Operational Categoy 3', 'operational_category_3'),
            ('BWF Case?', 'bwf_case'),
        ):
            if row[column]:
                attributes.append(['SERVICE', service_id, label, row[column][:500], 'string'])

        columns = {
            'approval': split_bullets(row['ApprovalFlow']),
            'entitlement': split_bullets(row['Entitlement']),
            'fulfillment': split_bullets(row['Fulfillment Type']),
            'sla': split_bullets(row['SLA']),
            'support': split_bullets(row['SupportGroup']),
        }

        names = OrderedDict()
        for source in ('fulfillment', 'sla', 'approval', 'support', 'entitlement'):
            for name in columns[source]:
                names.setdefault(key(name), name)

        indexed = {
            source: {key(name): value for name, value in items.items()}
            for source, items in columns.items()
        }

        def pick(source, name_key, raw_column):
            if indexed[source]:
                return indexed[source].get(name_key, '')
            return row[raw_column]

        if not names:
            names = OrderedDict({key(service_name): service_name})

        for index, (name_key, name) in enumerate(names.items(), start=1):
            sub_id = f'{service_id}-{index:02d}'
            sub_services.append([sub_id, service_id, name, 'Service Request', 'Y'])

            raw_entitlement = pick('entitlement', name_key, 'Entitlement')
            note = ''
            note_match = ENTITLEMENT_NOTE_RE.search(raw_entitlement)
            if note_match:
                note = clean(note_match.group(0))[:400]
                raw_entitlement = clean(ENTITLEMENT_NOTE_RE.sub('', raw_entitlement))
            if raw_entitlement:
                entitlements.append([
                    f'ENT-{sub_id}', sub_id, raw_entitlement[:250], note,
                ])

            parsed_sla = parse_sla(pick('sla', name_key, 'SLA'))
            if parsed_sla:
                target, unit = parsed_sla
                slas.append([
                    f'SLA-{sub_id}', sub_id,
                    int(target) if float(target).is_integer() else target,
                    unit,
                ])

            for level, (approver_type, approver) in enumerate(
                parse_approvals(pick('approval', name_key, 'ApprovalFlow')), start=1
            ):
                approvals.append([sub_id, level, approver_type, approver])

            ticket_type = parse_ticket_type(pick('fulfillment', name_key, 'Fulfillment Type'))
            groups, mode = parse_support_groups(pick('support', name_key, 'SupportGroup'))
            if ticket_type and groups:
                for seq, group in enumerate(groups, start=1):
                    assignments.append([sub_id, seq, group, ticket_type, mode])
                    support_groups.setdefault(group, ['', '', ''])

            raw_fulfillment = pick('fulfillment', name_key, 'Fulfillment Type')
            if raw_fulfillment and not ticket_type:
                attributes.append([
                    'SUB_SERVICE', sub_id, 'fulfillment_note', raw_fulfillment[:500], 'string',
                ])

    sheets = OrderedDict([
        ('Services', (
            ['service_id', 'service_name', 'domain', 'owner_name', 'owner_pr_id',
             'owner_email', 'description'],
            services,
        )),
        ('SubServices', (
            ['sub_service_id', 'service_id', 'sub_service_name', 'request_type', 'active'],
            sub_services,
        )),
        ('Entitlements', (
            ['entitlement_id', 'sub_service_id', 'entitlement', 'entitlement_note'],
            entitlements,
        )),
        ('SLAs', (['sla_id', 'sub_service_id', 'sla_target', 'sla_unit'], slas)),
        ('Approvals', (['sub_service_id', 'level', 'approver_type', 'approver'], approvals)),
        ('Assignments', (
            ['sub_service_id', 'seq', 'support_group', 'ticket_type', 'execution_mode'],
            assignments,
        )),
        ('SupportGroups', (
            ['support_group_id', 'support_group', 'tier', 'coverage', 'email'],
            [[f'SG-{index:03d}', name, tier, coverage, email]
             for index, (name, (tier, coverage, email)) in enumerate(support_groups.items(), 1)],
        )),
        ('Attributes', (['entity_type', 'entity_id', 'key', 'value', 'data_type'], attributes)),
    ])

    with pd.ExcelWriter(OUT, engine='openpyxl') as writer:
        for sheet, (header, rows) in sheets.items():
            pd.DataFrame(rows, columns=header).to_excel(writer, sheet_name=sheet, index=False)

    for sheet, (_, rows) in sheets.items():
        print(f'{sheet}: {len(rows)} rows')
    print('written', OUT)


if __name__ == '__main__':
    main()
