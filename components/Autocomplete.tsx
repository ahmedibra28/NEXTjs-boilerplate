import classNames from 'classnames'
import React, { memo, useRef, useState } from 'react'

type Props = {
  items: string[]
  value: string
  onChange(val: string): void
}

//we are using dropdown, input and menu component from daisyui
const Autocomplete = (props: Props) => {
  const { items, value, onChange } = props
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  return (
    <div
      // use classnames here to easily toggle dropdown open
      className={classNames({
        'dropdown w-full': true,
        'dropdown-open': open,
      })}
      ref={ref}
    >
      <input
        type='text'
        className='input input-bordered w-full'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Type something..'
        tabIndex={0}
      />
      {/* add this part */}
      <div className='dropdown-content bg-base-200 top-14 max-h-96 overflow-auto flex-col rounded-md'>
        <ul
          className='menu menu-compact '
          // use ref to calculate the width of parent
          style={{ width: ref.current?.clientWidth }}
        >
          {items?.map((item, index) => {
            return (
              <li
                key={index}
                tabIndex={index + 1}
                onClick={() => {
                  onChange(item)
                  setOpen(false)
                }}
                className='border-b border-b-base-content/10 w-full'
              >
                <button>{item}</button>
              </li>
            )
          })}
        </ul>
        {/* add this part */}
      </div>
    </div>
  )
}

export default memo(Autocomplete)
