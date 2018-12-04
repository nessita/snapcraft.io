// returns release history filtered by history filters
export function getFilteredReleaseHistory(state) {
  const releases = state.releases;
  const revisions = state.revisions;
  const filters = state.history.filters;

  return (
    releases
      // only releases of revisions (ignore closing channels)
      .filter(release => release.revision)
      // only releases in given architecture
      .filter(release => {
        return filters && filters.arch
          ? release.architecture === filters.arch
          : true;
      })
      // only releases in given track
      .filter(release => {
        return filters && filters.track
          ? release.track === filters.track
          : true;
      })
      // only releases in given risk
      .filter(release => {
        return filters && filters.risk ? release.risk === filters.risk : true;
      })
      // before we have branches support we ignore any releases to branches
      .filter(release => !release.branch)
      // only one latest release of every revision
      .filter((release, index, all) => {
        return all.findIndex(r => r.revision === release.revision) === index;
      })
      // map release history to revisions
      .map(release => {
        return {
          ...revisions[release.revision],
          release
        };
      })
  );
}