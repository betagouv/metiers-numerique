import { useQuery } from '@apollo/client'
import { queries } from '@app/queries'
import { Institution } from '@prisma/client'

import { Select, SelectProps } from './Select'

type InstitutionSelectProps = Omit<SelectProps, 'options'>

export function InstitutionSelect({ isDisabled, ...props }: InstitutionSelectProps) {
  const { data, loading } = useQuery<
    {
      getInstitutionsList: Institution[]
    },
    any
  >(queries.institution.GET_LIST)

  const options =
    data?.getInstitutionsList?.map(institution => ({ label: institution.name, value: institution.id })) || []

  return <Select {...props} isDisabled={isDisabled || loading} options={options} />
}
