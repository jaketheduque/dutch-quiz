const FlavorCombo = (params) => {
    return (
        <div className="card outline shadow-lg text-black text-center">
            <div className="card-body p-4">
                <h1 className="card-title justify-center mb-3 text-4xl font-bold">{params.combo.name}</h1>
                <div>
                    {params.combo.expand.flavors.map((flavor) => {
                        return <p className="text-center">{flavor.name}</p>
                    })}
                </div>
            </div>
        </div>
    )
}

export default FlavorCombo;