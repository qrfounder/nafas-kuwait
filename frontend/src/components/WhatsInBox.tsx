import { BundleContents } from './BundleContents'

export function WhatsInBox({
  includes,
  boxCount = 1,
}: {
  includes: string[]
  boxCount?: number
}) {
  return <BundleContents includes={includes} boxCount={boxCount} layout="cards" />
}
