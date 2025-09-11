const Filter = ({onFilterChange, filterVal}) => {
  return (
    <div> filter shown with
      <input onChange={onFilterChange} value={filterVal} />
    </div>
  )
}

export default Filter;