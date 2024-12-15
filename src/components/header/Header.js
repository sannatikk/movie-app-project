import './Header.css';

function MainHeader({text}) {
    return (
            <h1 className="main-header">{text}</h1>
    )
}

function SectionHeader({text}) {
    return (
            <h3 className="section-header">{text}</h3>
    )
}

export { MainHeader, SectionHeader }