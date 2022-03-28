# use-telephone

A React hook for building phone number inputs

### Installation

`use-telephone` depends on React >= 16.8, so make sure you have it installed.

```
yarn add use-telephone react
```

### Usage

```tsx
import {useTelephone, countries} from 'use-telephone';

export default function App() {
	const telephone = useTelephone();

	return (
		<>
			<select value={telephone.country} onChange={e => telephone.onChangeCountry(e.target.value)}>
				{countries.map(country => {
					return (
						<option key={country.value} value={country.value}>
							{country.label}
						</option>
					);
				})}
			</select>

			<img src={telephone.flag} alt="Flag of the current selected country" />

			<input placeholder="(xxx) xxx-xxxx" value={telephone.value} onChange={telephone.onChange} />
		</>
	);
}
```
