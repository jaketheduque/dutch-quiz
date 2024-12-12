const FlavorCombo = (combo) => {
    function toDisplay(s) {
        return s.toLowerCase().replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase());
    }

    const name = toDisplay(combo.combo.name);

    return (
        <div className="card">
            <div className="card-body">
                <h1 className="card-title justify-center mb-4 text-4xl font-bold">{name}</h1>
                <div>
                    {combo.combo.expand.flavors.map((flavor) => {
                        return <p className="text-center">{toDisplay(flavor.name)}</p>
                    })}
                </div>
            </div>
        </div>
    )
}

export default FlavorCombo;