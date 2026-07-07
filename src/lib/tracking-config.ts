export function buildGoogleAdsSendTo(
	adsId: string | undefined,
	label: string | undefined,
): string | undefined {
	if (!adsId || !label) return undefined;
	return `${adsId}/${label}`;
}

export function getGoogleAdsId(): string | undefined {
	return import.meta.env.PUBLIC_GOOGLE_ADS_ID || undefined;
}

export function getGoogleAdsLeadSendTo(): string | undefined {
	const override = import.meta.env.PUBLIC_GOOGLE_ADS_LEAD_SEND_TO;
	if (override) return override;

	return buildGoogleAdsSendTo(
		import.meta.env.PUBLIC_GOOGLE_ADS_ID,
		import.meta.env.PUBLIC_GOOGLE_ADS_LEAD_LABEL,
	);
}

export function getGoogleAdsWhatsAppSendTo(): string | undefined {
	const override = import.meta.env.PUBLIC_GOOGLE_ADS_WHATSAPP_SEND_TO;
	if (override) return override;

	return buildGoogleAdsSendTo(
		import.meta.env.PUBLIC_GOOGLE_ADS_ID,
		import.meta.env.PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL,
	);
}
