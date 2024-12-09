const FormElement = ({label, type="text", name, placeholder, value, handleInputChange, index, className}) => {
  return (
    <div className={className}>
        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</label>
        <input
        type={type}
        name={name}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInputChange(e, index)}
      />
    </div>
  )
}
export default FormElement