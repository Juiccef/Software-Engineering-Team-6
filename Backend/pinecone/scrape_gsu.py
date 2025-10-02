import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

# List of URLs you want to scrape
urls = {
    "cs_four_year_plan": "https://csds.gsu.edu/b-s-in-computer-science-four-year-plan-of-study/",
    "cs_program_page": "https://catalogs.gsu.edu/preview_program.php?catoid=17&poid=4348&returnto=1421",
    "cs_course_descriptions": "https://catalogs.gsu.edu/content.php?catoid=17&navoid=1434",
    "cs_undergrad_faqs": "https://csds.gsu.edu/undergraduate-programs/undergraduate-faqs/",
    "cs_two_year_schedule": "https://csds.gsu.edu/undergraduate-programs/undergraduate-two-year-schedule/",
    "cs_tutoring": "https://csds.gsu.edu/tutoring/",
    "cs_advisement": "https://csds.gsu.edu/advisement/",
    "cs_dual_degree": "https://csds.gsu.edu/dual-degree/"
}


# Create a folder to save scraped files
output_dir = "scraped_data"
os.makedirs(output_dir, exist_ok=True)

def clean_filename(url):
    """Convert a URL into a safe filename."""
    parsed = urlparse(url)
    filename = parsed.netloc + parsed.path
    filename = filename.strip("/").replace("/", "_")
    if not filename:  # handle root pages
        filename = parsed.netloc
    return filename + ".txt"

for url in urls:
    try:
        print(f"Scraping {url} ...")
        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text(separator="\n", strip=True)

        filename = clean_filename(url)
        filepath = os.path.join(output_dir, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(text)

        print(f"Saved: {filepath}")

    except Exception as e:
        print(f"Failed to scrape {url}: {e}")
