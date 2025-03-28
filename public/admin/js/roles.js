// Permissions
const tablePermissions = document.querySelector("table[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("button[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    let permissions = [];

    const rows = tablePermissions.querySelectorAll("[data-name]");

    rows.forEach((row) => {
      const name = row.getAttribute("data-name");

      if (name == "id") {
        const inputs = row.querySelectorAll("input");

        inputs.forEach((input) => {
          permissions.push({
            id: input.value,
            permissions: [],
          });
        });
      } else {
        const inputs = row.querySelectorAll("input");

        inputs.forEach((input, index) => {
          if (input.checked) {
            permissions[index].permissions.push(`${name}`);
          }
        });
      }
    });

    if (permissions.length > 0) {
      const formChangePermissions = document.querySelector("#form-change-permissions");
      const inputChangePermissions = formChangePermissions.querySelector("input[name='permissions']");

      inputChangePermissions.value = JSON.stringify(permissions);
      formChangePermissions.submit();
    }
  });
}
// End Permissions

// Permissions Data Default
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records"));
  const tablePermissions = document.querySelector("table[table-permissions]");

  records.forEach((record, index) => {
    const permissions = record.permissions;

    permissions.forEach(permission => {
      const tr = tablePermissions.querySelector(`[data-name='${permission}']`);
      const input = tr.querySelectorAll("input")[index];
      
      input.checked = true;
    })
  })
}
// End Permissions Data Default