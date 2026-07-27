import { describe, expect, it } from 'vitest';
import {
	FOOTER_DESTINATIONS,
	HOME_DESTINATIONS,
	HOME_FEATURED_PROPERTIES,
	INACTIVE_DESTINATION_SLUGS,
	INACTIVE_ROUTE_PATHS,
	NAV_LINKS,
} from './constants';
import { getPublishedHubs, isRoutePublished, SITE_ROUTES } from './site-routes';

describe('Nordeste destination deactivated', () => {
	it('keeps nordeste routes registered but not published', () => {
		const paths = new Set(SITE_ROUTES.map((route) => route.path));
		expect(paths.has('/nordeste/')).toBe(true);
		expect(paths.has('/nordeste/resorts-all-inclusive/')).toBe(true);
		expect(isRoutePublished('/nordeste/')).toBe(false);
		expect(isRoutePublished('/nordeste/resorts-all-inclusive/')).toBe(false);
		expect(getPublishedHubs().some((hub) => hub.path === '/nordeste/')).toBe(false);
	});

	it('hides nordeste from nav, footer, home destinations and featured properties', () => {
		expect(INACTIVE_ROUTE_PATHS.has('/nordeste/')).toBe(true);
		expect(INACTIVE_DESTINATION_SLUGS.has('nordeste')).toBe(true);

		expect(NAV_LINKS.some((link) => link.href === '/nordeste/')).toBe(false);
		expect(FOOTER_DESTINATIONS.some((link) => link.href === '/nordeste/')).toBe(false);
		expect(HOME_DESTINATIONS.some((dest) => dest.slug === 'nordeste')).toBe(false);
		expect(
			HOME_FEATURED_PROPERTIES.some((item) => item.href.startsWith('/nordeste/')),
		).toBe(false);
	});
});
