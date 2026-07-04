import { describe, expect, it } from 'vitest';
import { SITE } from './constants';

const SEO_KEYWORDS = ['hospedagens', 'hotéis', 'resorts', 'parques', 'brasil'];
const VALUE_PROPS = ['segurança', 'rapidez', 'preço justo'];

describe('brand messaging', () => {
	it('tagline is SEO-focused on hospitality sales in Brazil', () => {
		const tagline = SITE.tagline.toLowerCase();
		for (const keyword of SEO_KEYWORDS) {
			expect(tagline).toContain(keyword);
		}
		for (const prop of VALUE_PROPS) {
			expect(tagline).toContain(prop);
		}
	});

	it('tagline does not use leveza framing', () => {
		expect(SITE.tagline.toLowerCase()).not.toContain('leveza');
	});
});
