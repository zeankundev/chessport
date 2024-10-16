import { useRef, useState } from "react";
import '../App.css';

interface Properties {
    icon: string;
    action: (() => void) | undefined;
    isToggleable: boolean;
    isReversibleState?: boolean;
}

export default function ActionButton(props: Properties) {
    const [isVoidDone, setIsVoidDone] = useState(false);
    const componentButton = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        if (props.isToggleable) {
            if (props.isReversibleState) {
                setIsVoidDone(prevState => !prevState);
                componentButton.current!.classList.toggle('activated');
            } else {
                setIsVoidDone(true);
                componentButton.current!.classList.add('activated');
            }
        }
        if (props.action) {
            props.action();
        }
    };

    return (
        <div className="component-button" ref={componentButton} onClick={handleClick}>
            <span className="material-symbols-outlined" translate="no">{props.icon}</span>
        </div>
    );
}
