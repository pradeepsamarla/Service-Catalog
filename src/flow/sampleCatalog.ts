import type { Service } from './types';

const workingDays = (target: number) => ({
  target,
  unit: 'working day',
  label: `${target} working day${target === 1 ? '' : 's'}`,
  risk: 'timed' as const,
});

const hours = (target: number) => ({
  target,
  unit: 'hour',
  label: `${target} hour${target === 1 ? '' : 's'}`,
  risk: 'timed' as const,
});

const noSla = {
  target: null,
  unit: '',
  label: 'No SLA defined',
  risk: 'none' as const,
};

export const sampleCatalog: Service[] = [
  {
    id: 'SVC-HR',
    name: 'HR Services',
    domain: 'People & Workplace',
    ownerName: 'Aisha Al Marri',
    ownerPrId: 'PR100234',
    ownerEmail: 'aisha.almarri@example.com',
    description: 'Employee lifecycle and people services',
    subServices: [
      {
        id: 'SS-HR-ONB',
        name: 'Employee Onboarding Request',
        requestType: 'Service Request',
        active: true,
        entitlements: [
          { id: 'ENT-001', entitlement: 'All DEWA Users', note: 'Self + on behalf of' },
        ],
        approvals: [
          { level: 1, approverType: 'ROLE', approver: 'Direct Manager' },
          { level: 2, approverType: 'GROUP', approver: 'HR Head' },
        ],
        assignments: [
          {
            seq: 1,
            supportGroup: 'HR-Ops',
            ticketType: 'Work Order',
            executionMode: 'PARALLEL',
            tier: 'L2',
            coverage: '24x5',
          },
          {
            seq: 2,
            supportGroup: 'IT-Service-Desk',
            ticketType: 'Work Order',
            executionMode: 'PARALLEL',
            tier: 'L1',
            coverage: '24x7',
          },
          {
            seq: 3,
            supportGroup: 'Facilities',
            ticketType: 'Work Order',
            executionMode: 'PARALLEL',
            tier: 'L2',
            coverage: '8x5',
          },
        ],
        sla: workingDays(3),
        attributes: [
          { key: 'requires_badge', value: 'true' },
          { key: 'induction_track', value: 'Corporate' },
        ],
      },
      {
        id: 'SS-HR-OFF',
        name: 'Employee Offboarding',
        requestType: 'Service Request',
        active: true,
        entitlements: [
          { id: 'ENT-002', entitlement: 'All DEWA Users', note: 'Manager initiated' },
        ],
        approvals: [
          { level: 1, approverType: 'ROLE', approver: 'Direct Manager' },
          { level: 2, approverType: 'GROUP', approver: 'IT Security' },
        ],
        assignments: [
          {
            seq: 1,
            supportGroup: 'HR-Ops',
            ticketType: 'Work Order',
            executionMode: 'SEQUENCE',
            tier: 'L2',
            coverage: '24x5',
          },
          {
            seq: 2,
            supportGroup: 'IT-Service-Desk',
            ticketType: 'Work Order',
            executionMode: 'SEQUENCE',
            tier: 'L1',
            coverage: '24x7',
          },
        ],
        sla: workingDays(2),
        attributes: [],
      },
      {
        id: 'SS-HR-SAL',
        name: 'Salary Certificate',
        requestType: 'Service Request',
        active: true,
        entitlements: [
          { id: 'ENT-003', entitlement: 'DEWA Employees', note: 'Entitled requesters' },
        ],
        approvals: [{ level: 1, approverType: 'ROLE', approver: 'Direct Manager' }],
        assignments: [
          {
            seq: 1,
            supportGroup: 'HR-Shared-Services',
            ticketType: 'Work Order',
            executionMode: 'PARALLEL',
            tier: 'L1',
            coverage: '8x5',
          },
        ],
        sla: workingDays(1),
        attributes: [],
      },
      {
        id: 'SS-HR-TRV',
        name: 'Business Travel Request',
        requestType: 'Service Request',
        active: true,
        entitlements: [{ id: 'ENT-004', entitlement: 'DEWA Employees', note: 'Grade 8+' }],
        approvals: [
          { level: 1, approverType: 'ROLE', approver: 'Direct Manager' },
          { level: 2, approverType: 'GROUP', approver: 'Finance' },
          { level: 3, approverType: 'GROUP', approver: 'HR Head' },
        ],
        assignments: [
          {
            seq: 1,
            supportGroup: 'HR-Travel-Desk',
            ticketType: 'Work Order',
            executionMode: 'PARALLEL',
            tier: 'L2',
            coverage: '8x5',
          },
        ],
        sla: workingDays(5),
        attributes: [],
      },
      {
        id: 'SS-HR-POL',
        name: 'HR Policy Inquiry',
        requestType: 'Service Request',
        active: true,
        entitlements: [
          { id: 'ENT-005', entitlement: 'All DEWA Users', note: 'Entitled requesters' },
        ],
        approvals: [],
        assignments: [
          {
            seq: 1,
            supportGroup: 'HR-Helpdesk',
            ticketType: 'Work Order',
            executionMode: 'PARALLEL',
            tier: 'L1',
            coverage: '8x5',
          },
        ],
        sla: noSla,
        attributes: [],
      },
    ],
  },
  {
    id: 'SVC-ITEU',
    name: 'IT End-User Services',
    domain: 'Technology',
    ownerName: 'Omar Hassan',
    ownerPrId: 'PR100781',
    ownerEmail: 'omar.hassan@example.com',
    description: 'End-user devices, access and software',
    subServices: [
      {
        id: 'SS-IT-LAP',
        name: 'Laptop Request',
        requestType: 'Service Request',
        active: true,
        entitlements: [{ id: 'ENT-006', entitlement: 'DEWA Employees', note: 'Grade 6+' }],
        approvals: [
          { level: 1, approverType: 'ROLE', approver: 'Direct Manager' },
          { level: 2, approverType: 'GROUP', approver: 'IT Asset Management' },
        ],
        assignments: [
          {
            seq: 1,
            supportGroup: 'IT-Asset-Management',
            ticketType: 'Work Order',
            executionMode: 'SEQUENCE',
            tier: 'L2',
            coverage: '8x5',
          },
          {
            seq: 2,
            supportGroup: 'IT-Service-Desk',
            ticketType: 'Work Order',
            executionMode: 'SEQUENCE',
            tier: 'L1',
            coverage: '24x7',
          },
        ],
        sla: workingDays(5),
        attributes: [{ key: 'asset_class', value: 'Laptop-Standard' }],
      },
      {
        id: 'SS-IT-PWD',
        name: 'Password Reset',
        requestType: 'Service Request',
        active: true,
        entitlements: [{ id: 'ENT-007', entitlement: 'All DEWA Users', note: 'Self service' }],
        approvals: [],
        assignments: [
          {
            seq: 1,
            supportGroup: 'IT-Service-Desk',
            ticketType: 'Incident',
            executionMode: 'PARALLEL',
            tier: 'L1',
            coverage: '24x7',
          },
        ],
        sla: hours(4),
        attributes: [{ key: 'self_service_url', value: 'https://sso/reset' }],
      },
      {
        id: 'SS-IT-SFW',
        name: 'Software Installation',
        requestType: 'Service Request',
        active: true,
        entitlements: [
          { id: 'ENT-008', entitlement: 'DEWA Employees', note: 'Licensed catalogue only' },
        ],
        approvals: [{ level: 1, approverType: 'ROLE', approver: 'Direct Manager' }],
        assignments: [
          {
            seq: 1,
            supportGroup: 'IT-Service-Desk',
            ticketType: 'Work Order',
            executionMode: 'PARALLEL',
            tier: 'L1',
            coverage: '24x7',
          },
        ],
        sla: workingDays(2),
        attributes: [],
      },
      {
        id: 'SS-IT-VPN',
        name: 'Remote VPN Access',
        requestType: 'Service Request',
        active: true,
        entitlements: [
          { id: 'ENT-009', entitlement: 'DEWA Employees', note: 'Approved remote workers' },
        ],
        approvals: [
          { level: 1, approverType: 'ROLE', approver: 'Direct Manager' },
          { level: 2, approverType: 'GROUP', approver: 'IT Security' },
        ],
        assignments: [
          {
            seq: 1,
            supportGroup: 'IT-Network',
            ticketType: 'Work Order',
            executionMode: 'SEQUENCE',
            tier: 'L2',
            coverage: '24x5',
          },
          {
            seq: 2,
            supportGroup: 'IT-Security',
            ticketType: 'Work Order',
            executionMode: 'SEQUENCE',
            tier: 'L3',
            coverage: '24x5',
          },
        ],
        sla: workingDays(1),
        attributes: [],
      },
    ],
  },
];
