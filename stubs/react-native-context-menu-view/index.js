
import React from 'react';
export default function ContextMenuView({children, onPress, previewBackgroundColor, dropdownMenuMode, menuConfig, onPressMenuItem, onPressMenuPreview, isMenuPrimaryAction, ...props}){
    return React.createElement('div', {...props, onClick: onPress}, children);
}

