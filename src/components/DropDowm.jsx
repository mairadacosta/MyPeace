import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";

export default function CustomDropdown({ buttonText, menuItems }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="bg-[#00bfa6] text-white border-[#009a87] hover:bg-white hover:text-[#00bfa6] transition-colors ease-in-out duration-300"
        >
          {buttonText}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        variant="flat"
        aria-label="Dropdown menu"
        className="bg-[#f9f9f9] rounded-lg shadow-lg"
      >
        {menuItems.map((item) => (
          <DropdownItem
            key={item.key}
            shortcut={item.shortcut}
            className={`text-black flex items-center gap-2 ${item.className}`}
            color={item.color}
            onClick={item.onClick}
          >
            {item.icon && (
              <span className="icon text-[#00bfa6]">
                {item.icon}
              </span>
            )}
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
