'use client'

import { useState, useRef, useEffect } from 'react'

interface CountryDropdownProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Yugoslavia", "Zaire", "Zambia", "Zimbabwe"
]

export default function CountryDropdown({ value, onChange, placeholder = "Select country" }: CountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCountries, setFilteredCountries] = useState(countries)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCountries(filtered)
  }, [searchTerm])

  const handleSelect = (country: string) => {
    onChange(country)
    setIsOpen(false)
    setSearchTerm('')
  }

  const displayValue = value || placeholder

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid var(--border2)',
          background: 'var(--card2)',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span style={{ color: value ? 'var(--text)' : 'var(--text3)' }}>
          {displayValue}
        </span>
        <span style={{ color: 'var(--text3)' }}>▼</span>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            zIndex: 1000,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            maxHeight: '200px',
            overflow: 'auto',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: 'none',
              borderBottom: '1px solid var(--border2)',
              outline: 'none',
              fontSize: '14px'
            }}
          />
          <div style={{ maxHeight: '150px', overflow: 'auto' }}>
            {filteredCountries.slice(0, 10).map(country => (
              <div
                key={country}
                onClick={() => handleSelect(country)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border2)',
                  background: country === value ? 'var(--green-tint)' : 'transparent',
                  color: country === value ? 'var(--green)' : 'var(--text)',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.stopPropagation()}
              >
                {country}
              </div>
            ))}
            {filteredCountries.length > 10 && (
              <div style={{ 
                padding: '8px 12px', 
                textAlign: 'center', 
                color: 'var(--text3)', 
                fontSize: '12px',
                fontStyle: 'italic'
              }}>
                ...and {filteredCountries.length - 10} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
