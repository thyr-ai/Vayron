#!/usr/bin/env python3
"""
Fetch Strava activities and generate records
"""

import json
import requests
from datetime import datetime, timedelta
from pathlib import Path

CREDS_FILE = '/home/administrator/vayron/credentials/strava-api.json'
DATA_DIR = Path('/home/administrator/vayron/ovning-se/data')

def load_credentials():
    """Load Strava API credentials"""
    with open(CREDS_FILE) as f:
        return json.load(f)

def refresh_token(creds):
    """Refresh access token if expired"""
    now = datetime.now().timestamp()
    
    if creds['token_expiry'] < now + 300:  # Refresh if expires within 5 min
        print("🔄 Refreshing access token...")
        response = requests.post('https://www.strava.com/oauth/token', data={
            'client_id': creds['client_id'],
            'client_secret': creds['client_secret'],
            'refresh_token': creds['refresh_token'],
            'grant_type': 'refresh_token'
        })
        
        if response.status_code != 200:
            raise Exception(f"Token refresh failed: {response.text}")
        
        data = response.json()
        creds['access_token'] = data['access_token']
        creds['token_expiry'] = data['expires_at']
        
        # Save updated credentials
        with open(CREDS_FILE, 'w') as f:
            json.dump(creds, f, indent=2)
        
        print("✅ Token refreshed")
    
    return creds['access_token']

def fetch_all_activities(access_token, limit=1000):
    """Fetch all activities up to limit"""
    headers = {'Authorization': f'Bearer {access_token}'}
    activities = []
    page = 1
    
    print(f"📥 Fetching activities (max {limit})...")
    
    while len(activities) < limit:
        per_page = min(200, limit - len(activities))
        
        response = requests.get(
            'https://www.strava.com/api/v3/athlete/activities',
            headers=headers,
            params={'per_page': per_page, 'page': page}
        )
        
        if response.status_code == 429:  # Rate limit
            print("⏸️  Rate limit hit, waiting 15 minutes...")
            import time
            time.sleep(900)
            continue
        
        if response.status_code != 200:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
            break
        
        data = response.json()
        
        if not data:
            break
        
        activities.extend(data)
        print(f"   Fetched {len(activities)} activities...")
        page += 1
    
    print(f"✅ Total activities fetched: {len(activities)}")
    return activities

def analyze_records(activities):
    """Find personal records from activities"""
    print("🔍 Analyzing for records...")
    
    records = {
        'longest_run': None,
        'fastest_10k': None,
        'fastest_half_marathon': None,
        'fastest_marathon': None,
        'longest_ride': None,
        'most_elevation_single': None,
        'most_elevation_week': None,
        'most_active_week': None,
        'total_distance_year': 0,
        'total_moving_time_year': 0
    }
    
    current_year = datetime.now().year
    
    for activity in activities:
        activity_type = activity.get('type', '')
        distance = activity.get('distance', 0)
        moving_time = activity.get('moving_time', 0)
        elevation = activity.get('total_elevation_gain', 0)
        start_date = datetime.strptime(activity['start_date'], '%Y-%m-%dT%H:%M:%SZ')
        
        # Year-to-date totals
        if start_date.year == current_year:
            records['total_distance_year'] += distance
            records['total_moving_time_year'] += moving_time
        
        # Longest run
        if activity_type == 'Run':
            if not records['longest_run'] or distance > records['longest_run']['distance']:
                records['longest_run'] = {
                    'distance': distance,
                    'name': activity['name'],
                    'date': activity['start_date_local'],
                    'moving_time': moving_time,
                    'url': f"https://www.strava.com/activities/{activity['id']}"
                }
        
        # Fastest 10K (9.5-10.5 km)
        if activity_type == 'Run' and 9500 <= distance <= 10500:
            if not records['fastest_10k'] or moving_time < records['fastest_10k']['moving_time']:
                records['fastest_10k'] = {
                    'distance': distance,
                    'name': activity['name'],
                    'date': activity['start_date_local'],
                    'moving_time': moving_time,
                    'pace': moving_time / (distance / 1000),  # seconds per km
                    'url': f"https://www.strava.com/activities/{activity['id']}"
                }
        
        # Fastest half marathon (20.5-21.5 km)
        if activity_type == 'Run' and 20500 <= distance <= 21500:
            if not records['fastest_half_marathon'] or moving_time < records['fastest_half_marathon']['moving_time']:
                records['fastest_half_marathon'] = {
                    'distance': distance,
                    'name': activity['name'],
                    'date': activity['start_date_local'],
                    'moving_time': moving_time,
                    'pace': moving_time / (distance / 1000),
                    'url': f"https://www.strava.com/activities/{activity['id']}"
                }
        
        # Fastest marathon (41-43 km)
        if activity_type == 'Run' and 41000 <= distance <= 43000:
            if not records['fastest_marathon'] or moving_time < records['fastest_marathon']['moving_time']:
                records['fastest_marathon'] = {
                    'distance': distance,
                    'name': activity['name'],
                    'date': activity['start_date_local'],
                    'moving_time': moving_time,
                    'pace': moving_time / (distance / 1000),
                    'url': f"https://www.strava.com/activities/{activity['id']}"
                }
        
        # Longest ride
        if activity_type == 'Ride':
            if not records['longest_ride'] or distance > records['longest_ride']['distance']:
                records['longest_ride'] = {
                    'distance': distance,
                    'name': activity['name'],
                    'date': activity['start_date_local'],
                    'moving_time': moving_time,
                    'url': f"https://www.strava.com/activities/{activity['id']}"
                }
        
        # Most elevation gain (single activity)
        if not records['most_elevation_single'] or elevation > records['most_elevation_single']['elevation']:
            records['most_elevation_single'] = {
                'elevation': elevation,
                'name': activity['name'],
                'date': activity['start_date_local'],
                'type': activity_type,
                'distance': distance,
                'url': f"https://www.strava.com/activities/{activity['id']}"
            }
    
    print("✅ Records analysis complete")
    return records

def format_time(seconds):
    """Format seconds to HH:MM:SS"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"

def format_pace(seconds_per_km):
    """Format pace as MM:SS per km"""
    minutes = int(seconds_per_km // 60)
    secs = int(seconds_per_km % 60)
    return f"{minutes}:{secs:02d}"

def save_data(activities, records):
    """Save data to JSON files"""
    DATA_DIR.mkdir(exist_ok=True)
    
    # Save all activities
    activities_file = DATA_DIR / 'activities.json'
    with open(activities_file, 'w') as f:
        json.dump(activities, f, indent=2)
    print(f"💾 Saved {len(activities)} activities to {activities_file}")
    
    # Save records with formatted values
    formatted_records = {}
    for key, record in records.items():
        if record is None:
            continue
        
        if key.startswith('total_'):
            formatted_records[key] = record
            continue
        
        formatted = record.copy()
        
        if 'distance' in formatted:
            formatted['distance_km'] = round(formatted['distance'] / 1000, 2)
        
        if 'moving_time' in formatted:
            formatted['moving_time_formatted'] = format_time(formatted['moving_time'])
        
        if 'pace' in formatted:
            formatted['pace_formatted'] = format_pace(formatted['pace'])
        
        formatted_records[key] = formatted
    
    # Add year totals formatted
    if 'total_distance_year' in records:
        formatted_records['total_distance_year_km'] = round(records['total_distance_year'] / 1000, 2)
    
    if 'total_moving_time_year' in records:
        formatted_records['total_moving_time_year_formatted'] = format_time(records['total_moving_time_year'])
        formatted_records['total_moving_time_year_hours'] = round(records['total_moving_time_year'] / 3600, 1)
    
    records_file = DATA_DIR / 'records.json'
    with open(records_file, 'w') as f:
        json.dump(formatted_records, f, indent=2)
    print(f"🏆 Saved records to {records_file}")
    
    # Print summary
    print("\n📊 SUMMARY")
    print("=" * 50)
    if formatted_records.get('longest_run'):
        print(f"Längsta löpning: {formatted_records['longest_run']['distance_km']} km")
    if formatted_records.get('fastest_10k'):
        print(f"Snabbaste 10K: {formatted_records['fastest_10k']['moving_time_formatted']} ({formatted_records['fastest_10k']['pace_formatted']}/km)")
    if formatted_records.get('longest_ride'):
        print(f"Längsta cykeltur: {formatted_records['longest_ride']['distance_km']} km")
    if formatted_records.get('total_distance_year_km'):
        print(f"Totalt {datetime.now().year}: {formatted_records['total_distance_year_km']} km ({formatted_records['total_moving_time_year_hours']} h)")

def main():
    try:
        creds = load_credentials()
        access_token = refresh_token(creds)
        activities = fetch_all_activities(access_token, limit=1000)
        records = analyze_records(activities)
        save_data(activities, records)
        print("\n✅ All done!")
    except FileNotFoundError:
        print("❌ Credentials file not found. Run exchange_token.py first.")
        print(f"   Expected: {CREDS_FILE}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
