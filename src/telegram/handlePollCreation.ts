import { createNestedBlock } from '../roam/createNestedBlock'

export function handlePollCreation(poll, i, { maxOrder, inboxUid }) {
  createNestedBlock(inboxUid, {
    order: maxOrder + i,
    string: `((telegrampoll-${poll.id}))`,
    children: [
      {
        string: "{{[[table]]}}",
        children: poll.options.map(({ option, i }) => ({
          string: `((telegrampoll-${poll.id}-${i}))`,
          children: [
            {
              string: `${option.voter_count}`,
            },
          ],
        })),
      },
    ],
  });
}
