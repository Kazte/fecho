# fetcho

A fetch wrapper with typesafe and easy to use.

## Install

```shell
npm install fecho

yarn add fecho

pnpm add fecho
```

## Usage

```typescript
import { fecho } from 'fecho';

type User = {
  id: number;
  name: string;
};

const response = await fecho<User>(
  'https://jsonplaceholder.typicode.com/users/1',
);

console.log(response.data); // { id: 1, name: 'Leanne Graham' }
```
