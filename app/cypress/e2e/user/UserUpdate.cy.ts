// UserUpdate.cy
/// <reference types="cypress" />
import { de, faker } from '@faker-js/faker';

describe('UpdateUser', () => {
	beforeEach(() => {
		cy.visit(Cypress.env('login'));
		cy.get('#username-field').clear();
		cy.get('#username-field').type(Cypress.env('ADMIN_USER'));
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type(Cypress.env('ADMIN_PASSWORD'));
		cy.get('.inline-flex').click();

		// go to update user
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(2) > .flex > .ml-3').click();
		cy.get(':nth-child(2) > :nth-child(6) > .flex > [title="Actualizar usuario"] > .items-center').click();
	});

	it('cv base case', () => {
		cy.get('#name-field').clear();
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#username-field').clear();
		cy.get('#username-field').type(faker.internet.userName());
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type('Password12');

		// open roles select
		cy.get('[aria-label=Roles]').click();

		cy.get('[role="option"][aria-selected="true"]').then($selectedOption => {
			const selectedText = $selectedOption.text().trim();

			// Select an option that is not selected
			cy.get('[role="option"]').each($option => {
				const optionText = $option.text().trim();

				if (optionText !== selectedText) {
					cy.wrap($option).click();
					return false;
				}
			});
		});

		cy.get('.bg-success').click();
		cy.get('[role="status"]').should('have.text', 'Usuario actualizado correctamente.');
	});

	// name
	it('ci name empty', () => {
		cy.get('#name-field').clear();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'Ingresa el nombre.');
	});

	// username
	it('ci username empty', () => {
		cy.get('#username-field').clear();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'Ingresa el usuario.');
	});

	it('ci username exists', () => {
		cy.get('#username-field').clear();
		cy.get('#username-field').type('admin');

		cy.get('.bg-success').click();
		cy.get('[role="status"]').should('have.text', 'El nombre de usuario "admin" no está disponible. Intente con otro.');
	});

	// password
	it('ci password leght < 8', () => {
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type('Pass12');

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'La contraseña debe ser de mínimo 8 caracteres.');
	});

	it('ci password dont have number', () => {
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type('Password');

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'La contraseña debe contener mayúsculas, minúsculas y números.');
	});

	it('ci password dont have uppercase', () => {
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type('password12');

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'La contraseña debe contener mayúsculas, minúsculas y números.');
	});

	it('ci password dont have lowercase', () => {
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type('PASSWORD12');

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'La contraseña debe contener mayúsculas, minúsculas y números.');
	});

	it('ci password empty', () => {
		cy.get('#pass-field').clear();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'Ingresa la contraseña.');
	});

	// Role
	it('ci not select role', () => {
		cy.get('[aria-label=Roles]').click();

		// deselect the selected role
		cy.get('[role="option"][aria-selected="true"]').click();
		cy.get('.bg-success').click();

		cy.get('.my-auto').should('have.text', 'Selecciona un rol.');
	});

	// Status
	it('ci not select status', () => {
		cy.get('[aria-label=Estado]').click();

		// deselect the selected status
		cy.get('[role="option"][aria-selected="true"]').click();
		cy.get('.bg-success').click();

		cy.get('.my-auto').should('have.text', 'Selecciona un estado.');
	});
});
