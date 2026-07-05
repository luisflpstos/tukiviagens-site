import {
	MIN_STAY_DAYS,
	MONTH_NAMES,
	addDays,
	formatDateDisplay,
	formatDateISO,
	getMinCheckInDate,
	getMinCheckOutDate,
	isDateBefore,
	isDateInRange,
	isSameDay,
	parseDateISO,
} from '../lib/date-rules';

type SelectionStep = 'entrada' | 'saida';

export function initLeadDatePicker(root: HTMLElement): void {
	const entradaInput = root.querySelector<HTMLInputElement>('input[name="data_entrada"]');
	const saidaInput = root.querySelector<HTMLInputElement>('input[name="data_saida"]');
	const entradaTrigger = root.querySelector<HTMLButtonElement>('[data-date-trigger="entrada"]');
	const saidaTrigger = root.querySelector<HTMLButtonElement>('[data-date-trigger="saida"]');
	const calendar = root.querySelector<HTMLElement>('[data-calendar]');
	const titleEl = root.querySelector<HTMLElement>('[data-cal-title]');
	const gridEl = root.querySelector<HTMLElement>('[data-cal-grid]');
	const hintEl = root.querySelector<HTMLElement>('[data-cal-hint]');
	const prevBtn = root.querySelector<HTMLButtonElement>('[data-cal-prev]');
	const nextBtn = root.querySelector<HTMLButtonElement>('[data-cal-next]');

	if (
		!entradaInput ||
		!saidaInput ||
		!entradaTrigger ||
		!saidaTrigger ||
		!calendar ||
		!titleEl ||
		!gridEl ||
		!hintEl ||
		!prevBtn ||
		!nextBtn
	) {
		return;
	}

	const minCheckIn = getMinCheckInDate();
	let viewMonth = new Date(minCheckIn.getFullYear(), minCheckIn.getMonth(), 1);
	let open = false;
	let step: SelectionStep = 'entrada';
	let entradaDate: Date | null = null;
	let saidaDate: Date | null = null;

	const syncTriggers = () => {
		entradaTrigger.textContent = entradaInput.value
			? formatDateDisplay(entradaInput.value)
			: 'Selecionar data';
		saidaTrigger.textContent = saidaInput.value ? formatDateDisplay(saidaInput.value) : 'Selecionar data';
		entradaTrigger.classList.toggle('text-tuki-muted', !entradaInput.value);
		saidaTrigger.classList.toggle('text-tuki-muted', !saidaInput.value);
	};

	const setHint = (message: string) => {
		hintEl.textContent = message;
	};

	const closeCalendar = () => {
		open = false;
		calendar.hidden = true;
		delete calendar.dataset.step;
		entradaTrigger.setAttribute('aria-expanded', 'false');
		saidaTrigger.setAttribute('aria-expanded', 'false');
		entradaTrigger.classList.remove('tuki-date-trigger--active');
		saidaTrigger.classList.remove('tuki-date-trigger--active');
	};

	const openCalendar = (nextStep: SelectionStep) => {
		open = true;
		step = nextStep;
		calendar.hidden = false;
		calendar.dataset.step = nextStep;
		entradaTrigger.setAttribute('aria-expanded', String(nextStep === 'entrada'));
		saidaTrigger.setAttribute('aria-expanded', String(nextStep === 'saida'));

		entradaTrigger.classList.toggle('tuki-date-trigger--active', nextStep === 'entrada');
		saidaTrigger.classList.toggle('tuki-date-trigger--active', nextStep === 'saida');

		if (nextStep === 'entrada' && entradaInput.value) {
			entradaDate = parseDateISO(entradaInput.value);
			viewMonth = new Date(entradaDate.getFullYear(), entradaDate.getMonth(), 1);
		} else if (nextStep === 'saida' && saidaInput.value) {
			saidaDate = parseDateISO(saidaInput.value);
			viewMonth = new Date(saidaDate.getFullYear(), saidaDate.getMonth(), 1);
		} else if (entradaInput.value) {
			entradaDate = parseDateISO(entradaInput.value);
			viewMonth = new Date(entradaDate.getFullYear(), entradaDate.getMonth(), 1);
		} else {
			viewMonth = new Date(minCheckIn.getFullYear(), minCheckIn.getMonth(), 1);
		}

		setHint(
			nextStep === 'entrada'
				? 'Selecione a data de entrada (a partir de amanhã).'
				: `Selecione a data de saída (mínimo ${MIN_STAY_DAYS} dias de estadia).`,
		);
		renderCalendar();
	};

	const playCheckoutTransition = () => {
		calendar.classList.remove('tuki-date-picker--step-transition');
		gridEl.classList.remove('tuki-date-picker__grid--refresh');
		hintEl.classList.remove('tuki-date-picker__hint--refresh');

		window.requestAnimationFrame(() => {
			window.requestAnimationFrame(() => {
				calendar.classList.add('tuki-date-picker--step-transition');
				gridEl.classList.add('tuki-date-picker__grid--refresh');
				hintEl.classList.add('tuki-date-picker__hint--refresh');
			});
		});
	};

	const switchToSaidaStep = (checkIn: Date) => {
		entradaDate = checkIn;
		entradaInput.value = formatDateISO(checkIn);
		saidaDate = null;
		saidaInput.value = '';
		step = 'saida';
		open = true;
		calendar.hidden = false;
		calendar.dataset.step = 'saida';
		entradaTrigger.setAttribute('aria-expanded', 'false');
		saidaTrigger.setAttribute('aria-expanded', 'true');

		entradaTrigger.classList.remove('tuki-date-trigger--active');
		saidaTrigger.classList.add('tuki-date-trigger--active');

		const minCheckout = getMinCheckOutDate(checkIn);
		viewMonth = new Date(minCheckout.getFullYear(), minCheckout.getMonth(), 1);

		setHint(`Selecione a data de saída (mínimo ${MIN_STAY_DAYS} dias de estadia).`);
		syncTriggers();
		renderCalendar();
		playCheckoutTransition();
	};

	const applySelection = (date: Date) => {
		if (step === 'entrada') {
			switchToSaidaStep(date);
			return;
		}

		if (!entradaDate) {
			step = 'entrada';
			setHint('Selecione primeiro a data de entrada.');
			return;
		}

		const minCheckout = getMinCheckOutDate(entradaDate);
		if (isDateBefore(date, minCheckout)) {
			setHint(
				`Estadia mínima de ${MIN_STAY_DAYS} dias. Saída a partir de ${formatDateDisplay(formatDateISO(minCheckout))}.`,
			);
			return;
		}

		saidaDate = date;
		saidaInput.value = formatDateISO(date);
		syncTriggers();
		renderCalendar();
		closeCalendar();
	};

	const handleDayClick = (iso: string, disabled: boolean) => {
		if (disabled) return;
		applySelection(parseDateISO(iso));
	};

	const isDayDisabled = (date: Date): boolean => {
		if (step === 'entrada') {
			return isDateBefore(date, minCheckIn);
		}

		if (!entradaDate) return isDateBefore(date, minCheckIn);
		return isDateBefore(date, getMinCheckOutDate(entradaDate));
	};

	const renderCalendar = () => {
		titleEl.textContent = `${MONTH_NAMES[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;

		const monthStart = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
		const monthEnd = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
		const leadingEmpty = monthStart.getDay();

		prevBtn.disabled =
			viewMonth.getFullYear() < minCheckIn.getFullYear() ||
			(viewMonth.getFullYear() === minCheckIn.getFullYear() &&
				viewMonth.getMonth() <= minCheckIn.getMonth());

		gridEl.innerHTML = '';

		for (let i = 0; i < leadingEmpty; i += 1) {
			const spacer = document.createElement('span');
			spacer.className = 'tuki-date-picker__day tuki-date-picker__day--empty';
			spacer.setAttribute('aria-hidden', 'true');
			gridEl.appendChild(spacer);
		}

		for (let day = 1; day <= monthEnd.getDate(); day += 1) {
			const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
			const iso = formatDateISO(date);
			const disabled = isDayDisabled(date);
			const isEntrada = entradaDate ? isSameDay(date, entradaDate) : false;
			const isSaida = saidaDate ? isSameDay(date, saidaDate) : false;
			const inRange =
				entradaDate && saidaDate ? isDateInRange(date, entradaDate, saidaDate) : false;

			const button = document.createElement('button');
			button.type = 'button';
			button.textContent = String(day);
			button.dataset.date = iso;
			button.className = 'tuki-date-picker__day';
			if (disabled) button.classList.add('tuki-date-picker__day--disabled');
			if (isEntrada) button.classList.add('tuki-date-picker__day--start');
			if (isSaida) button.classList.add('tuki-date-picker__day--end');
			if (inRange && !isEntrada && !isSaida) button.classList.add('tuki-date-picker__day--in-range');
			if (disabled) button.disabled = true;

			button.addEventListener('click', () => handleDayClick(iso, disabled));
			gridEl.appendChild(button);
		}
	};

	entradaTrigger.addEventListener('click', () => {
		if (open && step === 'entrada') {
			closeCalendar();
			return;
		}
		openCalendar('entrada');
	});

	saidaTrigger.addEventListener('click', () => {
		if (!entradaInput.value) {
			openCalendar('entrada');
			return;
		}
		if (open && step === 'saida') {
			closeCalendar();
			return;
		}
		entradaDate = parseDateISO(entradaInput.value);
		openCalendar('saida');
	});

	prevBtn.addEventListener('click', () => {
		viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
		renderCalendar();
	});

	nextBtn.addEventListener('click', () => {
		viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
		renderCalendar();
	});

	document.addEventListener('click', (event) => {
		if (!open) return;
		const target = event.target as Node;
		if (!root.contains(target)) closeCalendar();
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && open) closeCalendar();
	});

	root.closest('form')?.addEventListener('reset', () => {
		entradaDate = null;
		saidaDate = null;
		closeCalendar();
		syncTriggers();
	});

	syncTriggers();
}
