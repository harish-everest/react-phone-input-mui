import { render, fireEvent, cleanup, prettyDOM } from 'react-testing-library'
import React from 'react'
import PhoneInput from "../src";
import { TextField } from '@mui/material';


afterEach(cleanup)

describe('<PhoneInput /> countries props', () => {
  test('has not "us" country in the dropdown', () => {
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        excludeCountries={['us']}
      />)

    fireEvent.click(phoneInput.querySelector('.selected-flag'))
    expect(phoneInput.querySelectorAll('li[data-country-code="us"]').length).toBe(0)
    expect(phoneInput.querySelectorAll('li[data-country-code="gb"]').length).toBe(1)
  })

  test('has only "us" country in the dropdown', () => {
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        onlyCountries={['us']}
      />)

    fireEvent.click(phoneInput.querySelector('.selected-flag'))
    expect(phoneInput.querySelectorAll('li[data-country-code="us"]').length).toBeGreaterThan(0)
    expect(phoneInput.querySelectorAll('li[data-country-code="gb"]').length).toBe(0)
  })

  test('has "us" in the preferred countries section', () => {
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        preferredCountries={['us']}
      />)

    fireEvent.click(phoneInput.querySelector('.selected-flag'))
    expect(phoneInput.querySelector('.country-list').children[0].dataset.countryCode).toBe('us')
  })
})


describe('<PhoneInput /> main props', () => {
  test('has "us" as the default/highlighted country', () => {
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        country='us'
      />)

    fireEvent.click(phoneInput.querySelector('.selected-flag'))
    expect(phoneInput.querySelector('.selected-flag').children[0].classList).toContain('us')
    expect(phoneInput.querySelector('li[data-country-code="us"]').classList).toContain('highlight')
  })

  test('receive formatted value', () => {
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        value='+3802343252'
      />)
    expect(phoneInput.querySelector('input').value).toBe('+380 (23) 432 52')
  })
})


describe('<PhoneInput /> event handlers', () => {
  test('onChange is called with unformatted value and country object as callback arguments', () => {
    const mockFn = jest.fn();
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        country={'us'}
        onChange={mockFn}
      />)

    fireEvent.change(phoneInput.querySelector('input'), {target: {value: '12345'}})
    expect(mockFn).toHaveBeenCalledWith('12345', {name: 'United States', dialCode: '1', 'format': '+. (...) ...-....', countryCode: 'us'}, expect.any(Object), '+1 (234) 5')
  })
})


describe('<PhoneInput /> other props', () => {
  test('pass inputProps into the input', () => {
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        inputProps={{name: 'phone'}}
      />)

    expect(phoneInput.querySelector('input').name).toBe('phone')
  })

  test('filter european countries with the regions={\'europe\'} prop', () => {
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        regions={'europe'}
      />)

    fireEvent.click(phoneInput.querySelector('.selected-flag'))
    expect(phoneInput.querySelectorAll('li[data-country-code="us"]').length).toBe(0)
    expect(phoneInput.querySelectorAll('li[data-country-code="ca"]').length).toBe(0)
    expect(phoneInput.querySelectorAll('li[data-country-code="ua"]').length).toBe(1)
    expect(phoneInput.querySelectorAll('li[data-country-code="fr"]').length).toBe(1)
  })

  test('localize countries labels using "localization" prop', () => {
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        onlyCountries={['de', 'es']}
        localization={{'Germany': 'Deutschland', 'Spain': 'España'}}
      />)

    fireEvent.click(phoneInput.querySelector('.selected-flag'))
    expect(phoneInput.querySelector('li[data-country-code="de"]').querySelector('.country-name').textContent).toBe('Deutschland')
    expect(phoneInput.querySelector('li[data-country-code="es"]').querySelector('.country-name').textContent).toBe('España')
  })

  test('render custom mask with the "masks" prop', () => {
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        country='fr'
        onlyCountries={['fr']}
        masks={{'fr': '(...) ..-..-..'}}
        value='33543773322'
      />)

    fireEvent.click(phoneInput.querySelector('.selected-flag'))
    expect(phoneInput.querySelector('input').value).toBe('+33 (543) 77-33-22')
  })

  test('not renders area codes with disableAreaCodes', () => {
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        disableAreaCodes
      />)

    fireEvent.click(phoneInput.querySelector('.selected-flag'))
    expect(phoneInput.querySelectorAll('li[data-country-code="us"]').length).toBe(1)
    expect(phoneInput.querySelectorAll('li[data-country-code="ca"]').length).toBe(1)
  })

  test('search correct country via search field', () => {
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        enableSearch
      />)

    fireEvent.click(phoneInput.querySelector('.selected-flag'))
    fireEvent.change(phoneInput.querySelector('.search-box'), {target: {value: 'gb'}})
    expect(phoneInput.querySelector('.country-list').children.length).toBe(2) // search field & 1 search result
    expect(phoneInput.querySelector('.country-list').children[1].querySelector('.country-name').textContent).toBe('United Kingdom')
  })

  test('search "undefined" string returns no non-matching results', () => {
    const { container: phoneInput } = render(
      <PhoneInput
        component={TextField}
        enableSearch
      />)

    fireEvent.click(phoneInput.querySelector('.selected-flag'))
    fireEvent.change(phoneInput.querySelector('.search-box'), {target: {value: 'undefined'}})
    expect(phoneInput.querySelector('.no-entries-message')).toBeTruthy()
  })
})


describe('correct value update', () => {
  test('should rerender without crashing', () => {
    const { container: phoneInput, rerender } = render(
      <PhoneInput
        component={TextField}
        value={undefined}
      />)

    rerender(
      <PhoneInput
        component={TextField}
        value="+3802343252"
      />)

    rerender(
      <PhoneInput
        component={TextField}
        value=""
      />)

    rerender(
      <PhoneInput
        component={TextField}
        value={null}
      />)

    expect(phoneInput.querySelector('.selected-flag').children.length).toBe(1)
    expect(phoneInput.querySelector('.selected-flag').children[0].className).toContain('flag 0')
  })

  test('should rerender country without crashing', () => {
    const { container: phoneInput, rerender } = render(
      <PhoneInput
        component={TextField}
        country={undefined}
      />)

    rerender(
      <PhoneInput
        component={TextField}
        country="us"
      />)

    rerender(
      <PhoneInput
        component={TextField}
        country="es"
      />)

    expect(phoneInput.querySelector('.selected-flag').children.length).toBe(1)
    expect(phoneInput.querySelector('.selected-flag').children[0].className).toContain('flag es')
  })

  it('renders one prefix when updated from empty value', () => {
    const { container: phoneInput, rerender } = render(
      <PhoneInput
        component={TextField}
        value=""
      />)

    rerender(
      <PhoneInput
        component={TextField}
        value="+49 1701 601234"
      />)

    expect(phoneInput.querySelector('input').value).toBe('+49 1701 601234')
  })
})
