<script>
  export let id;
  export let name;
  export let value = undefined;
  export let disabled = undefined;
  export let required = undefined;
  export let autofocus = undefined;

  import UIFormLabel from './UIFormLabel.svelte';
</script>

<label
  for={id}
  class="border-b-4 border-indigo-200 dark:border-gray-600
    focus-within:border-teal-400
    block mb-8
    ease-out duration-200 transition-colors"
>
  <UIFormLabel><slot /></UIFormLabel>
  <input
    {id}
    {name}
    bind:value
    type="text"
    class="appearance-none focus:outline-none
        bg-transparent border-none w-full py-1
        text-gray-800 dark:text-gray-200 text-2xl"
    autocomplete="off"
    {disabled}
    {required}
    {autofocus}
  />
</label>
