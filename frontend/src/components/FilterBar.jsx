function FilterBar({
  remote,
  setRemote,
  type,
  setType
}) {

  return (

    <div className="filter-bar">


      <div className="filter-item">

        <label>
          Job Type
        </label>

        <select
          value={type}
          onChange={(event) =>
            setType(event.target.value)
          }
        >

          <option value="">
            All Types
          </option>

          <option value="Full-time">
            Full-time
          </option>

          <option value="Part-time">
            Part-time
          </option>

          <option value="Internship">
            Internship
          </option>

          <option value="Contract">
            Contract
          </option>

        </select>

      </div>


      <label className="remote-filter">

        <input
          type="checkbox"
          checked={remote}
          onChange={(event) =>
            setRemote(event.target.checked)
          }
        />

        Remote Jobs

      </label>


    </div>

  );

}


export default FilterBar;