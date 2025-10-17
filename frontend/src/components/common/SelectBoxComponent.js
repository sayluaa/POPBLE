
import Select from "react-select";


//max는 최대 수용인원수 -> 변경가능
export function SelectBoxComponent ({max=10, value, onChange}) {
    
    const countOptions = Array.from({length:max},(_,i)=>({
        value:i+1,
        label:`${i+1}명`
    }))

    
    return(
        <Select
        value={countOptions.find((opt)=> opt.value === value) || null}
        options={countOptions}
        placeholder="인원선택"
        onChange={(select) => onChange(Number(select.value))}
        className="w-full"></Select>
    );
}

export default SelectBoxComponent;