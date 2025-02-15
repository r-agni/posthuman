from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import pandas as pd
import time
from datetime import datetime

class PublicRecordSearcher:
    def __init__(self):
        """Initialize the web driver"""
        self.driver = webdriver.Chrome()
        self.results = []
        
    def search_voter_records(self, name, state):
        """
        Search VoterRecords.com for public voter information
        """
        try:
            self.driver.get("https://voterrecords.com")
            search_box = self.driver.find_element(By.ID, "search-box")
            search_box.send_keys(f"{name} {state}")
            search_box.send_keys(Keys.RETURN)
            
            # Wait for results to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "voter-record"))
            )
            
            # Extract voter information
            records = self.driver.find_elements(By.CLASS_NAME, "voter-record")
            for record in records[:5]:  # Limit to first 5 results
                self.results.append({
                    'source': 'Voter Records',
                    'name': record.find_element(By.CLASS_NAME, "voter-name").text,
                    'location': record.find_element(By.CLASS_NAME, "voter-location").text,
                    'url': record.get_attribute("href")
                })
                
        except TimeoutException:
            print("No voter records found")
        except Exception as e:
            print(f"Error searching voter records: {e}")

    def search_legacy_obituaries(self, name):
        """
        Search Legacy.com for obituaries
        """
        try:
            self.driver.get("https://www.legacy.com")
            search_box = self.driver.find_element(By.NAME, "searchText")
            search_box.send_keys(name)
            search_box.send_keys(Keys.RETURN)
            
            # Wait for results
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "obit-result"))
            )
            
            # Extract obituary information
            obits = self.driver.find_elements(By.CLASS_NAME, "obit-result")
            for obit in obits[:5]:
                self.results.append({
                    'source': 'Legacy.com Obituaries',
                    'name': obit.find_element(By.CLASS_NAME, "obit-name").text,
                    'date': obit.find_element(By.CLASS_NAME, "obit-date").text,
                    'location': obit.find_element(By.CLASS_NAME, "obit-location").text,
                    'url': obit.get_attribute("href")
                })
                
        except TimeoutException:
            print("No obituaries found")
        except Exception as e:
            print(f"Error searching obituaries: {e}")

    def search_newspapers_archive(self, name):
        """
        Search Newspapers.com archives
        """
        try:
            self.driver.get("https://www.newspapers.com")
            search_box = self.driver.find_element(By.ID, "search-input")
            search_box.send_keys(name)
            search_box.send_keys(Keys.RETURN)
            
            # Wait for results
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "search-result"))
            )
            
            # Extract newspaper mentions
            articles = self.driver.find_elements(By.CLASS_NAME, "search-result")
            for article in articles[:5]:
                self.results.append({
                    'source': 'Newspapers.com',
                    'title': article.find_element(By.CLASS_NAME, "article-title").text,
                    'date': article.find_element(By.CLASS_NAME, "article-date").text,
                    'newspaper': article.find_element(By.CLASS_NAME, "newspaper-name").text,
                    'url': article.get_attribute("href")
                })
                
        except TimeoutException:
            print("No newspaper records found")
        except Exception as e:
            print(f"Error searching newspapers: {e}")

    def generate_report(self, search_criteria):
        """
        Generate a report from all search results
        """
        report = []
        report.append("Public Records Search Report")
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        # Add search criteria
        report.append("Search Criteria:")
        for key, value in search_criteria.items():
            report.append(f"- {key.title()}: {value}")
        report.append("")
        
        # Group results by source
        sources = set(result['source'] for result in self.results)
        for source in sources:
            report.append(f"\n{source}:")
            source_results = [r for r in self.results if r['source'] == source]
            if source_results:
                for result in source_results:
                    report.append("  " + "-" * 40)
                    for key, value in result.items():
                        if key != 'source':
                            report.append(f"  {key.title()}: {value}")
            else:
                report.append("  No records found")
        
        return "\n".join(report)

    def close(self):
        """Close the web driver"""
        self.driver.quit()

def main():
    # Example usage
    search_criteria = {
        "name": "John Smith",
        "state": "CA"
    }
    
    searcher = PublicRecordSearcher()
    
    try:
        # Perform searches
        searcher.search_voter_records(search_criteria["name"], search_criteria["state"])
        searcher.search_legacy_obituaries(search_criteria["name"])
        searcher.search_newspapers_archive(search_criteria["name"])
        
        # Generate and print report
        report = searcher.generate_report(search_criteria)
        print(report)
        
        # Save results to CSV
        df = pd.DataFrame(searcher.results)
        df.to_csv(f"search_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv", index=False)
        
    finally:
        searcher.close()

if __name__ == "__main__":
    main()