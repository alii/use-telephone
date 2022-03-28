import {ChangeEvent, useMemo, useState} from 'react';
import parse, {
	CountryCode,
	formatIncompletePhoneNumber,
	getCountries,
	getCountryCallingCode,
} from 'libphonenumber-js';

export function getCountryFlag(code: CountryCode, aspect = '3x2') {
	return `https://purecatamphetamine.github.io/country-flag-icons/${aspect}/${code}.svg`;
}

export const countries = getCountries()
	.map(country => ({
		label: new Intl.DisplayNames(['en'], {type: 'region'}).of(country)!,
		value: country,
	}))
	.sort((a, b) => a.label.localeCompare(b.label));

export interface Options {
	initialValue: string;
}

export function useTelephone(_options?: Partial<Options>) {
	const options: Options = {
		initialValue: '',
		..._options,
	};

	const [country, setCountry] = useState<CountryCode>(countries[0].value);
	const [input, setInputValue] = useState(options.initialValue);

	const {e164, valid} = useMemo(() => {
		const e164 = parse(input, {
			extract: true,
		});

		if (e164?.country && e164.isPossible()) {
			setCountry(old => {
				if (old === e164.country) {
					return old;
				}

				return e164.country ?? old;
			});
		}

		return {
			e164,
			valid: e164?.isValid() ?? false,
		};
	}, [input]);

	return {
		country,
		parsed: e164,
		valid,
		value: formatIncompletePhoneNumber(input, country),
		flag: getCountryFlag(country),
		number: e164?.number ?? null,

		onChange(event: ChangeEvent<HTMLInputElement>) {
			setInputValue(event.target.value);
		},

		onChangeCountry(country: CountryCode) {
			setCountry(country);

			if (e164?.nationalNumber) {
				setInputValue('+' + getCountryCallingCode(country) + e164.nationalNumber);
				return;
			}

			setInputValue('+' + getCountryCallingCode(country));
		},
	} as const;
}

export default useTelephone;
