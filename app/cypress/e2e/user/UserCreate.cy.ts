// UserCreate.cy
/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('CreateUser test', () => {
	before(() => {
		// login
		cy.visit(Cypress.env('login'));
		cy.get('#username-field').type(Cypress.env('ADMIN_USER'));
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type(Cypress.env('ADMIN_PASSWORD'));
		cy.get('.inline-flex').click();
	});

	it('cv base case', () => {
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(2) > .flex > .ml-3').click();
		cy.get('.flex-wrap > .justify-center').click();
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#username-field').clear();
		cy.get('#username-field').type(faker.internet.userName());
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type('Password12');

		// open options select
		cy.get('[aria-label=Roles]').click();

		// select a random role
		cy.get('[role="option"]')
			.eq(faker.number.int({ min: 0, max: 2 }))
			.click();

		cy.get('.bg-success').click();
		cy.get('[role="status"]').should('have.text', 'Usuario creado correctamente.');
	});

	// name
	it('ci name empty', () => {
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(2) > .flex > .ml-3').click();
		cy.get('.flex-wrap > .justify-center').click();
		cy.get('#username-field').type(faker.internet.userName());
		cy.get('#pass-field').type('Password12');

		// open options select
		cy.get('[aria-label=Roles]').click();

		// select a random role
		cy.get('[role="option"]')
			.eq(faker.number.int({ min: 0, max: 2 }))
			.click();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'Ingresa el nombre.');
	});

	// username
	it('ci username exists', () => {
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(2) > .flex > .ml-3').click();
		cy.get('.flex-wrap > .justify-center').click();
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#username-field').type('admin');
		cy.get('#pass-field').type('Password12');

		// open options select
		cy.get('[aria-label=Roles]').click();

		// select a random role
		cy.get('[role="option"]')
			.eq(faker.number.int({ min: 0, max: 2 }))
			.click();

		cy.get('.bg-success').click();
		cy.get('[role="status"]').should('have.text', 'El nombre de usuario "admin" no está disponible. Intente con otro.');
	});

	it('ci empty username', () => {
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(2) > .flex > .ml-3').click();
		cy.get('.flex-wrap > .justify-center').click();
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#pass-field').type('Password12');

		// open options select
		cy.get('[aria-label=Roles]').click();

		// select a random role
		cy.get('[role="option"]')
			.eq(faker.number.int({ min: 0, max: 2 }))
			.click();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'Ingresa el usuario.');
	});

	// password
	it('ci password leght < 8', () => {
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(2) > .flex > .ml-3').click();
		cy.get('.flex-wrap > .justify-center').click();
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#username-field').type(faker.internet.userName());
		cy.get('#pass-field').type('Pass12');

		// open options select
		cy.get('[aria-label=Roles]').click();

		// select a random role
		cy.get('[role="option"]')
			.eq(faker.number.int({ min: 0, max: 2 }))
			.click();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'La contraseña debe ser de mínimo 8 caracteres.');
	});

	it('ci password dont have number', () => {
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(2) > .flex > .ml-3').click();
		cy.get('.flex-wrap > .justify-center').click();
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#username-field').type(faker.internet.userName());
		cy.get('#pass-field').type('Password');

		// open options select
		cy.get('[aria-label=Roles]').click();

		// select a random role
		cy.get('[role="option"]')
			.eq(faker.number.int({ min: 0, max: 2 }))
			.click();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'La contraseña debe contener mayúsculas, minúsculas y números.');
	});

	it('ci password dont have uppercase', () => {
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(2) > .flex > .ml-3').click();
		cy.get('.flex-wrap > .justify-center').click();
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#username-field').type(faker.internet.userName());
		cy.get('#pass-field').type('password12');

		// open options select
		cy.get('[aria-label=Roles]').click();

		// select a random role
		cy.get('[role="option"]')
			.eq(faker.number.int({ min: 0, max: 2 }))
			.click();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'La contraseña debe contener mayúsculas, minúsculas y números.');
	});

	it('ci password dont have lowercase', () => {
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(2) > .flex > .ml-3').click();
		cy.get('.flex-wrap > .justify-center').click();
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#username-field').type(faker.internet.userName());
		cy.get('#pass-field').type('PASSWORD12');

		// open options select
		cy.get('[aria-label=Roles]').click();

		// select a random role
		cy.get('[role="option"]')
			.eq(faker.number.int({ min: 0, max: 2 }))
			.click();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'La contraseña debe contener mayúsculas, minúsculas y números.');
	});

	it('ci password empty', () => {
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(2) > .flex > .ml-3').click();
		cy.get('.flex-wrap > .justify-center').click();
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#username-field').type(faker.internet.userName());

		// open options select
		cy.get('[aria-label=Roles]').click();

		// select a random role
		cy.get('[role="option"]')
			.eq(faker.number.int({ min: 0, max: 2 }))
			.click();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'Ingresa la contraseña.');
	});

	// Role

	it('ci not select role', () => {
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(2) > .flex > .ml-3').click();
		cy.get('.flex-wrap > .justify-center').click();
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#username-field').type(faker.internet.userName());
		cy.get('#pass-field').type('Password12');

		// click save
		cy.get('.bg-success').click();

		// check error
		cy.get('.my-auto').should('have.text', 'Selecciona un rol.');
	});
});
