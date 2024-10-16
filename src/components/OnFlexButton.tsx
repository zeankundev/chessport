import React, { useRef, useState } from "react";
import '../App.css';

interface Properties {
    icon?: string;
    children: React.ReactNode;
    action: (() => void) | undefined;
}

export default function OnFlexButton(props: Properties) {
    const componentButton = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        if (props.action) {
            props.action();
        }
    };

    return (
        <div className="control-button" ref={componentButton} onClick={handleClick}>
            <span className="material-symbols-outlined" translate="no">{props.icon}</span>&nbsp;{props.children}
        </div>
    );
}
