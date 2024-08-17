import React, { Fragment } from 'react'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'

const DropdownCheckbox = ({
  visibleColumns,
  setVisibleColumns,
}: {
  visibleColumns: { header: string; active: boolean }[]
  setVisibleColumns: React.Dispatch<
    React.SetStateAction<{ header: string; active: boolean }[]>
  >
}) => {
  const handleCheckboxChange = (index: number) => {
    const updatedColumns = [...visibleColumns]
    updatedColumns[index].active = !updatedColumns[index].active
    setVisibleColumns(updatedColumns)
  }

  return (
    <Fragment>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className='hover:bg-accent'>Filter</MenubarTrigger>
          <MenubarContent>
            {visibleColumns?.map((item, i: number) => (
              <MenubarCheckboxItem
                key={i}
                id={`checkbox-item-${i}`}
                onCheckedChange={() => handleCheckboxChange(i)}
                checked={item.active}
              >
                {item.header}
              </MenubarCheckboxItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Fragment>
  )
}
export default DropdownCheckbox
