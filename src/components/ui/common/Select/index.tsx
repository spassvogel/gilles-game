import React from 'react';
import Select, { Props} from 'react-select';


const DefaultSelect = (props: Props) => {
    return <Select
        styles={{
            control: (provided, state) => ({
                ...provided,
                minHeight: 'inherit',
                height: '32px',
                boxShadow: '0',
                border: state.isFocused ? '1px solid orange' : '1px solid #B1B1B1',
                ':hover': {
                    border: '1px solid orange'
                }             
            }),
            container: (provided, _state) => ({
                ...provided,
                flex: 1
            }),
            option: (provided) => ({
                ...provided,
                padding: '4px 12px',
            }),
            placeholder: (provided) => ({
                ...provided,
                whiteSpace: 'nowrap'
            }), 
            valueContainer: (provided) => ({
                ...provided,
                marginTop: '-2px'
            }), 
            indicatorsContainer: (provided) => ({
                ...provided,
                marginTop: '-2px',

                'div': {
                    padding: '4px'
                }
            }),
            
        }}
        {...props}
    />
}
DefaultSelect.displayName = "DefaultSelect";

export default DefaultSelect;