function Button({ text = "undefined text", onClick, width = "auto", height = "auto", minHeight = "20px", selected, children}) {
    const className = selected ? "btn btn_selected" : "btn";
    return (
        <button className={className} onClick={onClick} style={{width: width, height: height, minHeight: minHeight}}>
            {children ? children : text}
        </button>
    );
}

export default Button;