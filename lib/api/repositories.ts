export type Repository = {
  name: string;
};

export async function getRepositories(
  org = 'books-are-next'
): Promise<Repository[]> {
  const reposLink = `https://api.github.com/orgs/${org}/repos?per_page=1000`;
  const res = await fetch(reposLink);
  const repos = (await res.json()) as Repository[];
  const renamed: Repository[] = repos.map((repo) => {
    return { name: repo.name };
  });
  return renamed.filter(
    (repo) =>
      repo.name !== 'library' && repo.name !== 'books-are-next.github.io'
  );
}
