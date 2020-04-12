import {expectType} from 'tsd';
import test, {ExecutionContext, Macro} from '../experimental';

test('attempt', async t => {
	const attempt = await t.try(
		(u, a, b) => {
			expectType<ExecutionContext>(u);
			expectType<string>(a);
			expectType<number>(b);
		},
		'string',
		6
	);
	attempt.commit();
});

test('attempt with title', async t => {
	const attempt = await t.try(
		'attempt title',
		(u, a, b) => {
			expectType<ExecutionContext>(u);
			expectType<string>(a);
			expectType<number>(b);
		},
		'string',
		6
	);
	attempt.commit();
});

{
	const lengthCheck = (t: ExecutionContext, a: string, b: number): void => {
		t.is(a.length, b);
	};

	test('attempt with helper', async t => {
		const attempt = await t.try(lengthCheck, 'string', 6);
		attempt.commit();
	});

	test('attempt with title', async t => {
		const attempt = await t.try('title', lengthCheck, 'string', 6);
		attempt.commit();
	});
}

test('all possible variants to pass to t.try', async t => {
	// No params
	t.try(tt => tt.pass());

	t.try('test', tt => tt.pass());

	// Some params
	t.try((tt, a, b) => tt.is(a.length, b), 'hello', 5);

	t.try('test', (tt, a, b) => tt.is(a.length, b), 'hello', 5);

	// Macro with title
	const macro1 = test.macro({
		exec: (tt, a, b) => tt.is(a.length, b),
		title: (title, a, b) => `${title ? `${String(title)} ` : ''}str: "${String(a)}" with len: "${String(b)}"`
	});

	t.try(macro1, 'hello', 5);
	t.try('title', macro1, 'hello', 5);
});