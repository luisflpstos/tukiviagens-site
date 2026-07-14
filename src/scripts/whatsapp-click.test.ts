import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WHATSAPP_CLICK_API_PATH, sendWhatsAppClickPayload } from './whatsapp-click';
import type { WhatsAppClickPayload } from '../lib/whatsapp';

const samplePayload: WhatsAppClickPayload = {
	event: 'whatsapp_click',
	source: 'google',
	h1: 'Enjoy Solar',
	utm_source: 'google',
	utm_medium: 'cpc',
	utm_campaign: 'camp',
	utm_content: '',
	utm_term: '',
	gclid: '',
	gbraid: '',
	wbraid: '',
	fbclid: '',
	page_url: 'https://www.tukiviagens.com.br/lp/x/',
	page_title: 'LP',
	referrer: '',
	horario_local: '14/07/2026 13:00:00',
	timestamp_iso: '2026-07-14T16:00:00.000Z',
	user_agent: 'Mozilla/5.0',
	product: 'Enjoy Solar',
};

describe('sendWhatsAppClickPayload', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('exposes same-origin API path to avoid cross-origin CORS', () => {
		expect(WHATSAPP_CLICK_API_PATH).toBe('/api/whatsapp-click/');
	});

	it('sends beacon to same-origin proxy, not the external webhook', () => {
		const sendBeacon = vi.fn().mockReturnValue(true);
		vi.stubGlobal('navigator', { sendBeacon });

		sendWhatsAppClickPayload(samplePayload);

		expect(sendBeacon).toHaveBeenCalledOnce();
		const [url, blob] = sendBeacon.mock.calls[0]!;
		expect(url).toBe('/api/whatsapp-click/');
		expect(url).not.toContain('kortex.app.br');
		expect(blob).toBeInstanceOf(Blob);
		expect(blob.type).toBe('application/json');
	});

	it('falls back to fetch keepalive when sendBeacon is unavailable', () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true });
		vi.stubGlobal('navigator', {});
		vi.stubGlobal('fetch', fetchMock);

		sendWhatsAppClickPayload(samplePayload);

		expect(fetchMock).toHaveBeenCalledWith('/api/whatsapp-click/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(samplePayload),
			keepalive: true,
		});
	});
});
