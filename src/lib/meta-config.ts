/**
 * Configuração da integração direta com a Meta (Pixel + API de Conversões).
 *
 * - `PUBLIC_META_PIXEL_ID`: ID do Pixel/conjunto de dados (exposto ao browser para o fbq).
 * - `META_CAPI_TOKEN`: token de acesso da API de Conversões (somente servidor — nunca expor).
 * - `META_TEST_EVENT_CODE`: opcional, código de "Testar eventos" do Gerenciador de Eventos.
 */

export function getMetaPixelId(): string | undefined {
	return (
		(process.env.PUBLIC_META_PIXEL_ID ?? import.meta.env.PUBLIC_META_PIXEL_ID) || undefined
	);
}

export function getMetaCapiToken(): string | undefined {
	return (process.env.META_CAPI_TOKEN ?? import.meta.env.META_CAPI_TOKEN) || undefined;
}

export function getMetaTestEventCode(): string | undefined {
	return (
		(process.env.META_TEST_EVENT_CODE ?? import.meta.env.META_TEST_EVENT_CODE) || undefined
	);
}

/** A integração CAPI só é ativada quando pixel e token estão configurados. */
export function isMetaCapiEnabled(): boolean {
	return Boolean(getMetaPixelId() && getMetaCapiToken());
}
