package utils
import 	(
    "github.com/spf13/viper"
)

var MaxYear int = viper.GetInt("max_kit_year")  
var MinYear int = viper.GetInt("min_kit_year")

var ValidDesigns []string = viper.GetStringSlice("kit_designs")


func IsValidDesign(design string) bool {

    for _, des := range ValidDesigns{
        if des == design{
            return true
        }
    }
    return false
}

func IsValidYear(year int) bool{
    return ( year<=MaxYear && year>=MinYear )

}

func GetValidYears() []int{
    var ValidYears []int

    for year := MinYear ; year <=MaxYear ; year++ {
        ValidYears = append(ValidYears, year)
    }

    return ValidYears
}