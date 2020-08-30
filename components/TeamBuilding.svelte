<script type="text/typescript" lang="ts">
  import { roundstate } from '../stores/round';

  import TeamBuildingForm from './TeamBuildingForm.svelte';
  import TeamBuildingVote from './TeamBuildingVote.svelte';

  const phase = {
    TEAM_SELECTION: TeamBuildingForm,
    TEAM_VOTE: TeamBuildingVote,
  };
</script>

<svelte:component this="{phase[$roundstate]}" />
