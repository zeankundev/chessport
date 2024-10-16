import { useRef } from "react"
import '../App.css'
import { useLocation, Link } from 'react-router-dom'

interface Properties {
    path: string,
    icon: string
}

export default function Button(props:Properties) {
    const componentButton = useRef<HTMLDivElement>(null)
    const loc = useLocation()
    const isPage = loc.pathname === props.path
    isPage ? componentButton.current?.classList.add('activated') : componentButton.current?.classList.remove('activated')

    return (
        <Link to={props.path} className="component-button" ref={componentButton}>
            <div>
                <span className="material-symbols-outlined" translate="no">{props.icon}</span>
            </div>
        </Link>
    )
}