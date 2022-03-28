import {ChangeEvent, useMemo, useState} from 'react';
import parse, {CountryCode, getCountries, getCountryCallingCode} from 'libphonenumber-js';

export function getCountryFlag(code: CountryCode, aspect = '3x2') {
	return `http://purecatamphetamine.github.io/country-flag-icons/${aspect}/${code}.svg`;
}

export const countries = getCountries()
	.map(country => ({
		label: new Intl.DisplayNames(['en'], {type: 'region'}).of(country)!,
		value: country,
	}))
	.sort((a, b) => a.label.localeCompare(b.label));

export interface Options {
	defaultCountry: CountryCode;
	initialValue: string;
}

export function useTelephone(_options?: Partial<Options>) {
	const options: Options = {
		defaultCountry: 'US',
		initialValue: '',
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
		valid,
		value: input,
		flag: getCountryFlag(e164?.country ?? options.defaultCountry),
		country: e164?.country ?? null,
		number: e164?.number ?? null,

		getE164() {
			return e164;
		},

		onChange(event: ChangeEvent<HTMLInputElement>) {
			setInputValue(event.target.value);
		},

		onChangeCountry(country: CountryCode) {
			if (e164?.nationalNumber) {
				setInputValue(getCountryCallingCode(country) + e164.nationalNumber);
				return;
			}

			setInputValue(`+${getCountryCallingCode(country)}`);
		},
	} as const;
}

export default useTelephone;
