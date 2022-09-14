export default function Button({className = '', type = "button", children}) {
    
    return (
        <button className={
            `shadow-outline border-2 text-xs font-bold py-2 px-4 rounded mb-2 last:mb-0 ` + className
        } type={type}>{children}</button>
    );
}