import {ChangeEvent, useMemo, useState} from 'react';
import parse, {CountryCode} from 'libphonenumber-js';

export function getCountryFlag(code: CountryCode, aspect = '3x2') {
	return `http://purecatamphetamine.github.io/country-flag-icons/${aspect}/${code}.svg`;
}

export interface Options {
	defaultCountry: CountryCode;
	initialValue: string;
}

export function useTelephone(_options?: Partial<Options>) {
	const options: Options = {
		defaultCountry: 'US',
		initialValue: '+1 (123) 456-7890',
		..._options,
	};

	const [input, setInputValue] = useState(options.initialValue);

	const {e164, valid} = useMemo(() => {
		const e164 = parse(input);

		return {
			e164,
			valid: e164?.isValid() ?? false,
		};
	}, [input]);

	return {
		e164: e164?.number ?? null,
		onChange(event: ChangeEvent<HTMLInputElement>) {
			setInputValue(event.target.value);
		},
		valid,
		value: input,
		flag: getCountryFlag(e164?.country ?? options.defaultCountry),
	} as const;
}

export default useTelephone;
