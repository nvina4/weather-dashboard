

export default function SearchBar ({value, onChange}) {
    return(

        <input 
        type = "text"
        placeholder="Type your city"
        value={value}
        onChange={(e) => onChange(e.target.value)}

        />
    );
}