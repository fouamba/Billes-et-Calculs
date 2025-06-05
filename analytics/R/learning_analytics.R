# Installation et chargement des packages nécessaires
install.packages(c("mongolite", "tidyverse", "xaringan"))
library(mongolite)
library(tidyverse)

# Connexion à MongoDB Atlas
mongo_uri <- Sys.getenv("MONGODB_ATLAS_URI")
learninglocker_db <- mongo(url = mongo_uri)

# Fonction pour récupérer les données xAPI
get_xapi_data <- function(collection = "statements", query = "{}") {
  data <- learninglocker_db$find(query = query)
  return(data)
}

# Analyse cognitive load
analyze_cognitive_load <- function(student_id) {
  query <- sprintf('{"actor.mbox": "%s"}', student_id)
  student_data <- get_xapi_data(query = query)
  
  # Calculer la charge cognitive moyenne
  cognitive_load <- student_data %>%
    filter(!is.na(result.extensions$"https://w3id.org/xapi/cmi5/result/extensions/cognitive-load")) %>%
    summarise(
      avg_load = mean(result.extensions$"https://w3id.org/xapi/cmi5/result/extensions/cognitive-load"),
      std_load = sd(result.extensions$"https://w3id.org/xapi/cmi5/result/extensions/cognitive-load")
    )
    
  return(cognitive_load)
}

# Générer des visualisations
generate_learning_visualizations <- function(data) {
  # Créer des visualisations avec ggplot2
  ggplot(data, aes(x = timestamp, y = cognitive_load)) +
    geom_line() +
    theme_minimal() +
    labs(title = "Évolution de la charge cognitive",
         x = "Temps",
         y = "Charge cognitive")
  
  ggsave("cognitive_load_evolution.png")
}
