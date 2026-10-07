import { describe, expect, it } from 'vitest';
import { serializeJsonLd } from './seo';

describe('serializeJsonLd', () => {
	it('escapes characters that could close the <script> tag', () => {
		const json = serializeJsonLd({ name: 'FAQ </script><script>alert(1)</script> & mais' });

		expect(json).not.toContain('<');
		expect(json).not.toContain('>');
		expect(json).not.toContain('&');
		expect(JSON.parse(json)).toEqual({ name: 'FAQ </script><script>alert(1)</script> & mais' });
	});
});
