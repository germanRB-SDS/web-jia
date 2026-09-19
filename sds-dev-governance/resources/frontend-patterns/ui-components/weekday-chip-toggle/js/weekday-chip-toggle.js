// Optional master-checkbox sync for the weekday chip toggle strip.
// Checking the master clears + disables every chip; checking any chip clears the master.
// Skip this file entirely if you only need a plain multi-select chip strip.
export function initChipToggleGroup({ master, group, lockChips = false }) {
  const chips = [...group.querySelectorAll('input[type="checkbox"]')];
  const sync = () => {
    for (const input of chips) {
      input.disabled = lockChips || master.checked;
      if (master.checked) input.checked = false;
    }
  };
  master.addEventListener('change', sync);
  for (const input of chips) {
    input.addEventListener('change', () => {
      if (input.checked) master.checked = false;
      sync();
    });
  }
  sync();
  return {
    values: () => (master.checked ? [] : chips.filter((i) => i.checked).map((i) => i.value))
  };
}
