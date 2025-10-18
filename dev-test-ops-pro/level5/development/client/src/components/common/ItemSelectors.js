import { Button, Picker, Popup, Selector, DatePicker, Cascader } from 'antd-mobile'
import gotra from "../../data/gotra.json"
import { useEffect, useState } from 'react'
import { Form, Select } from 'antd'

export const GotraSelector = ({ customdata, setCustomdata, field }) => {
  const form = Form.useFormInstance();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const options = gotra.Gotra.map((item) => ({
    label: `${item.EName} / ${item.HName}`,
    value: item.Id,
    gotra: item,
  }));

  const handleConfirm = (val) => {
    const selectedOption = options.find((opt) => opt.value === val[0]);
    setSelected(selectedOption);
    form.setFieldsValue({ [field]: selectedOption?.gotra?.EName || "" });
    setCustomdata((prev) => ({
      ...prev,
      [field]: selectedOption?.gotra || null,
    }));
    setVisible(false);
  };

  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        style={{
          "--text-color": selected ? "#000" : "#999",
          "--background-color": "#fff",
          "--border-radius": "10px",
          "--border": "1px solid #fa541c",
          textAlign: "left",
          touchAction: "none",
          width: "100%",
        }}
      >
        {selected?.label || "Select Gotra"}
      </Button>

      <Picker
        columns={[options]}
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
        title="Select Gotra"
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </>
  );
};

export const ProfessionSelector = ({
  professions,
  customdata,
  setCustomdata,
  setFormData,
  convertToCascaderTree,
  field = "profession",
}) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState([]);

  const options =
    professions.length > 0 ? convertToCascaderTree(professions) : [];

  const handleConfirm = (val) => {
    setValue(val);

    const updatedProfession = {
      type: val[0],
      category: val[1],
      subcategory: val[2],
      role: val[3],
    };

    // Update customdata
    setCustomdata((prev) => ({
      ...prev,
      [field]: updatedProfession,
    }));

    // Optional formData update
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        ...updatedProfession,
      }));
    }

    setVisible(false);
  };

  useEffect(() => {
    const prof = customdata?.[field];
    if (
      prof &&
      prof.type &&
      prof.category &&
      prof.subcategory &&
      prof.role
    ) {
      setValue([prof.type, prof.category, prof.subcategory, prof.role]);
    }
  }, [customdata, field]);

  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        style={{
          "--background-color": "#fff",
          "--border": "1px solid #fa541c",
          "--border-radius": "10px",
          color: value.length ? "#000" : "#999",
          textAlign: "left",
          width: "100%",
        }}
      >
        {value[3] ? `${value[0]} / ${value[3]}` : "Select Profession"}
      </Button>

      <Cascader
        options={options}
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
        value={value}
      />
    </>
  );
};


// Date Selector
export const DateSelector = ({ customdata, setCustomdata, field }) => {
  const form = Form.useFormInstance()
  const [visible, setVisible] = useState(false)
  const [date, setDate] = useState('')

  const handleConfirm = (val) => {
    const formatted = val.toISOString().split('T')[0]
    setDate(formatted)
    form.setFieldsValue({ [field]: formatted })
    setCustomdata((prev) => ({
      ...prev,
      dob: formatted,
    }));
    setVisible(false)
  }

  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        style={{
          '--background-color': '#fff',
          '--border': '1px solid #fa541c',
          '--border-radius': '10px',
          color: date ? '#000' : '#999',
          textAlign: 'left',
          width: '100%',
          padding: '8px 12px',
          fontSize: '16px'
        }}
      >
        {date || 'Select Date'}
      </Button>

      <DatePicker
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
        style={{ '--height': '60vh', touchAction: 'none' }}
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </>
  )
}

// Marital Status Selector
export const MaritalStatusSelector = ({ customdata, setCustomdata, field }) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState([]);

  const options = [
    { label: "अविवाहित", value: "SINGLE" },
    { label: "विवाहित", value: "MARRIED" },
   
  ]

  const handleChange = (val) => {
    setValue(val);
    setCustomdata((prev) => ({
      ...prev,
      marital_status: { status: val[0] },
    }));
  };

  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        style={{
          '--background-color': '#fff',
          '--border': '1px solid #fa541c',
          '--border-radius': '10px',
          color: value[0] ? '#000' : '#999',
          textAlign: 'left',
          width: '100%',
          padding: '8px 12px',
          fontSize: '16px'
        }}
      >
        {value[0] || 'Select Marital Status'}
      </Button>

      <Popup
        visible={visible}
        onMaskClick={() => setVisible(false)}
        position="bottom"
        bodyStyle={{
          height: '60vh',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <div style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <h3 style={{ marginBottom: '16px' }}>Select Marital Status</h3>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Selector
              options={options}
              value={value}
              onChange={handleChange}
              multiple={false}
              style={{ touchAction: 'none' }}
            />
          </div>
          <Button
            color="primary"
            block
            style={{ marginTop: '16px' }}
            onClick={() => setVisible(false)}
          >
            Confirm
          </Button>
        </div>
      </Popup>
    </>
  )
}