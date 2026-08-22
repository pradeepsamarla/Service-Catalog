import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { buildLayout } from './layout';
import type { Service, SubService } from './types';

export type ExportFormat = 'png' | 'pdf';

const PADDING = 32;
const PIXEL_RATIO = 2;

function fileName(service: Service, subService: SubService, format: ExportFormat) {
  const slug = `${service.name}-${subService.name}`
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return `${slug}.${format}`;
}

function download(href: string, name: string) {
  const link = document.createElement('a');
  link.href = href;
  link.download = name;
  link.click();
}

function surfaceColor() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  return value || '#ffffff';
}

function layoutBounds(subService: SubService) {
  const { nodes } = buildLayout(subService);
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const node of nodes) {
    const width = Number(node.style?.width ?? 0);
    const height = Number(node.style?.height ?? 0);
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + width);
    maxY = Math.max(maxY, node.position.y + height);
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export async function exportFlow(
  service: Service,
  subService: SubService,
  format: ExportFormat,
) {
  const viewport = document.querySelector<HTMLElement>('.react-flow__viewport');
  if (!viewport) {
    throw new Error('Flow canvas is not ready yet');
  }

  const bounds = layoutBounds(subService);
  const width = Math.ceil(bounds.width + PADDING * 2);
  const height = Math.ceil(bounds.height + PADDING * 2);

  const png = await toPng(viewport, {
    backgroundColor: surfaceColor(),
    width,
    height,
    pixelRatio: PIXEL_RATIO,
    style: {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${PADDING - bounds.x}px, ${PADDING - bounds.y}px) scale(1)`,
      transformOrigin: '0 0',
    },
  });

  if (format === 'png') {
    download(png, fileName(service, subService, 'png'));
    return;
  }

  const pdf = new jsPDF({
    unit: 'pt',
    format: [width, height],
    orientation: width >= height ? 'landscape' : 'portrait',
    compress: true,
  });
  pdf.addImage(png, 'PNG', 0, 0, width, height);
  pdf.save(fileName(service, subService, 'pdf'));
}
