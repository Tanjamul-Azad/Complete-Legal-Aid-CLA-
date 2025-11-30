"""
Script to add sample Bengali data for citizens and lawyers
Run: python manage.py shell < add_sample_data.py
OR: python add_sample_data.py
"""
import os
import sys
import django
from datetime import date, timedelta
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cla_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from api.models import (
    CitizenProfile, LawyerProfile, LegalSpecialization, 
    LawyerSpecializationMap
)

User = get_user_model()

# Sample data storage for credentials
credentials = []

def create_legal_specializations():
    """Create legal specializations if they don't exist"""
    specializations = [
        {'name_en': 'Family Law', 'name_bn': 'পারিবারিক আইন', 'slug': 'family-law'},
        {'name_en': 'Criminal Law', 'name_bn': 'ফৌজদারি আইন', 'slug': 'criminal-law'},
        {'name_en': 'Civil Law', 'name_bn': 'দেওয়ানি আইন', 'slug': 'civil-law'},
        {'name_en': 'Labor Law', 'name_bn': 'শ্রম আইন', 'slug': 'labor-law'},
        {'name_en': 'Property Law', 'name_bn': 'সম্পত্তি আইন', 'slug': 'property-law'},
        {'name_en': 'Women Rights', 'name_bn': 'নারী অধিকার', 'slug': 'women-rights'},
    ]
    
    created = []
    for spec_data in specializations:
        spec, created_flag = LegalSpecialization.objects.get_or_create(
            slug=spec_data['slug'],
            defaults={
                'name_en': spec_data['name_en'],
                'name_bn': spec_data['name_bn'],
                'is_active': True
            }
        )
        if created_flag:
            created.append(spec_data['name_en'])
    
    if created:
        print(f"✓ Created specializations: {', '.join(created)}")
    else:
        print("✓ Specializations already exist")
    
    return LegalSpecialization.objects.all()


def create_sample_citizens():
    """Create sample citizen users with Bengali names"""
    citizens_data = [
        {
            'email': 'rahman.citizen@example.com',
            'phone': '+8801712345671',
            'password': 'Citizen@123',
            'full_name_en': 'Abdur Rahman',
            'full_name_bn': 'আবদুর রহমান',
            'gender': 'MALE',
            'nid': '1234567890',
            'division': 'Dhaka',
            'district': 'Dhaka',
            'address': 'House 12, Road 5, Dhanmondi, Dhaka-1205'
        },
        {
            'email': 'sultana.citizen@example.com',
            'phone': '+8801812345672',
            'password': 'Citizen@123',
            'full_name_en': 'Fatema Sultana',
            'full_name_bn': 'ফাতেমা সুলতানা',
            'gender': 'FEMALE',
            'nid': '1234567891',
            'division': 'Chittagong',
            'district': 'Chittagong',
            'address': 'Block B, Nasirabad, Chittagong-4220'
        },
        {
            'email': 'islam.citizen@example.com',
            'phone': '+8801912345673',
            'password': 'Citizen@123',
            'full_name_en': 'Md. Kamal Islam',
            'full_name_bn': 'মো. কামাল ইসলাম',
            'gender': 'MALE',
            'nid': '1234567892',
            'division': 'Rajshahi',
            'district': 'Rajshahi',
            'address': 'Shaheb Bazar, Rajshahi-6100'
        },
        {
            'email': 'begum.citizen@example.com',
            'phone': '+8801612345674',
            'password': 'Citizen@123',
            'full_name_en': 'Ayesha Begum',
            'full_name_bn': 'আয়েশা বেগম',
            'gender': 'FEMALE',
            'nid': '1234567893',
            'division': 'Khulna',
            'district': 'Khulna',
            'address': 'Royal Para, Khulna-9100'
        },
        {
            'email': 'hossain.citizen@example.com',
            'phone': '+8801512345675',
            'password': 'Citizen@123',
            'full_name_en': 'Imran Hossain',
            'full_name_bn': 'ইমরান হোসেন',
            'gender': 'MALE',
            'nid': '1234567894',
            'division': 'Sylhet',
            'district': 'Sylhet',
            'address': 'Zindabazar, Sylhet-3100'
        }
    ]
    
    created_citizens = []
    for data in citizens_data:
        try:
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults={
                    'phone_number': data['phone'],
                    'role': 'CITIZEN',
                    'is_active': True,
                    'is_verified': True,
                    'language_preference': 'BN'
                }
            )
            
            if created:
                user.set_password(data['password'])
                user.save()
                
                CitizenProfile.objects.create(
                    user=user,
                    full_name_en=data['full_name_en'],
                    full_name_bn=data['full_name_bn'],
                    gender=data['gender'],
                    nid_number=data['nid'],
                    present_address=data['address'],
                    permanent_address=data['address'],
                    geo_division=data['division'],
                    geo_district=data['district'],
                    date_of_birth=date(1990, 1, 1)
                )
                
                created_citizens.append(data['full_name_en'])
                credentials.append({
                    'type': 'Citizen',
                    'name': f"{data['full_name_en']} ({data['full_name_bn']})",
                    'email': data['email'],
                    'phone': data['phone'],
                    'password': data['password']
                })
        except Exception as e:
            print(f"✗ Error creating citizen {data['email']}: {str(e)}")
    
    if created_citizens:
        print(f"✓ Created {len(created_citizens)} citizens: {', '.join(created_citizens)}")
    else:
        print("✓ Citizens already exist")


def create_sample_lawyers(specializations):
    """Create sample lawyer users with Bengali names"""
    lawyers_data = [
        {
            'email': 'adv.chowdhury@example.com',
            'phone': '+8801711111111',
            'password': 'Lawyer@123',
            'full_name_en': 'Advocate Mahmudur Rahman Chowdhury',
            'full_name_bn': 'অ্যাডভোকেট মাহমুদুর রহমান চৌধুরী',
            'bar_council': 'DHK/2015/12345',
            'license_date': date(2015, 6, 15),
            'bio_en': 'Senior advocate specializing in family and civil law with 8+ years experience',
            'bio_bn': 'পারিবারিক ও দেওয়ানি আইনে বিশেষজ্ঞ ৮+ বছরের অভিজ্ঞতাসম্পন্ন সিনিয়র আইনজীবী',
            'chamber': 'Chamber: Supreme Court Bar Association, Dhaka',
            'fee_online': Decimal('1500.00'),
            'fee_offline': Decimal('3000.00'),
            'specializations': ['family-law', 'civil-law']
        },
        {
            'email': 'adv.akter@example.com',
            'phone': '+8801811111112',
            'password': 'Lawyer@123',
            'full_name_en': 'Advocate Nasrin Akter',
            'full_name_bn': 'অ্যাডভোকেট নাসরিন আক্তার',
            'bar_council': 'CTG/2017/23456',
            'license_date': date(2017, 8, 20),
            'bio_en': 'Women rights activist and lawyer focusing on domestic violence and child custody cases',
            'bio_bn': 'নারী অধিকার কর্মী ও আইনজীবী, পারিবারিক সহিংসতা ও শিশু হেফাজত মামলায় বিশেষজ্ঞ',
            'chamber': 'Chamber: Chittagong Bar Association, Chittagong',
            'fee_online': Decimal('1200.00'),
            'fee_offline': Decimal('2500.00'),
            'specializations': ['women-rights', 'family-law']
        },
        {
            'email': 'adv.karim@example.com',
            'phone': '+8801911111113',
            'password': 'Lawyer@123',
            'full_name_en': 'Advocate Abdul Karim Sheikh',
            'full_name_bn': 'অ্যাডভোকেট আবদুল করিম শেখ',
            'bar_council': 'RAJ/2012/34567',
            'license_date': date(2012, 3, 10),
            'bio_en': 'Criminal defense attorney with extensive trial experience',
            'bio_bn': 'ফৌজদারি মামলার অভিজ্ঞ আইনজীবী, ট্রায়াল কোর্টে বিশেষ দক্ষতাসম্পন্ন',
            'chamber': 'Chamber: Rajshahi Judge Court, Rajshahi',
            'fee_online': Decimal('1800.00'),
            'fee_offline': Decimal('3500.00'),
            'specializations': ['criminal-law']
        },
        {
            'email': 'adv.islam@example.com',
            'phone': '+8801611111114',
            'password': 'Lawyer@123',
            'full_name_en': 'Advocate Farzana Islam',
            'full_name_bn': 'অ্যাডভোকেট ফারজানা ইসলাম',
            'bar_council': 'KHL/2016/45678',
            'license_date': date(2016, 11, 5),
            'bio_en': 'Property and land law specialist with focus on dispute resolution',
            'bio_bn': 'সম্পত্তি ও ভূমি আইন বিশেষজ্ঞ, বিরোধ নিষ্পত্তিতে দক্ষ',
            'chamber': 'Chamber: Khulna District Court, Khulna',
            'fee_online': Decimal('1000.00'),
            'fee_offline': Decimal('2000.00'),
            'specializations': ['property-law', 'civil-law']
        },
        {
            'email': 'adv.rahman@example.com',
            'phone': '+8801511111115',
            'password': 'Lawyer@123',
            'full_name_en': 'Advocate Mizanur Rahman',
            'full_name_bn': 'অ্যাডভোকেট মিজানুর রহমান',
            'bar_council': 'SYL/2014/56789',
            'license_date': date(2014, 9, 25),
            'bio_en': 'Labor law expert representing workers and trade unions',
            'bio_bn': 'শ্রম আইন বিশেষজ্ঞ, শ্রমিক ও ট্রেড ইউনিয়নের প্রতিনিধিত্বকারী',
            'chamber': 'Chamber: Sylhet Bar Association, Sylhet',
            'fee_online': Decimal('1300.00'),
            'fee_offline': Decimal('2800.00'),
            'specializations': ['labor-law', 'civil-law']
        },
        {
            'email': 'adv.begum@example.com',
            'phone': '+8801711111116',
            'password': 'Lawyer@123',
            'full_name_en': 'Advocate Tahmina Begum',
            'full_name_bn': 'অ্যাডভোকেট তাহমিনা বেগম',
            'bar_council': 'DHK/2018/67890',
            'license_date': date(2018, 2, 14),
            'bio_en': 'Young lawyer passionate about family law and child protection',
            'bio_bn': 'তরুণ আইনজীবী, পারিবারিক আইন ও শিশু সুরক্ষায় উৎসাহী',
            'chamber': 'Chamber: Dhaka Chief Metropolitan Court, Dhaka',
            'fee_online': Decimal('900.00'),
            'fee_offline': Decimal('1800.00'),
            'specializations': ['family-law', 'women-rights']
        }
    ]
    
    created_lawyers = []
    for data in lawyers_data:
        try:
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults={
                    'phone_number': data['phone'],
                    'role': 'LAWYER',
                    'is_active': True,
                    'is_verified': True,
                    'language_preference': 'BN'
                }
            )
            
            if created:
                user.set_password(data['password'])
                user.save()
                
                lawyer_profile = LawyerProfile.objects.create(
                    user=user,
                    full_name_en=data['full_name_en'],
                    full_name_bn=data['full_name_bn'],
                    bar_council_number=data['bar_council'],
                    license_issue_date=data['license_date'],
                    bio_en=data['bio_en'],
                    bio_bn=data['bio_bn'],
                    chamber_address=data['chamber'],
                    consultation_fee_online=data['fee_online'],
                    consultation_fee_offline=data['fee_offline'],
                    verification_status='VERIFIED',
                    rating_average=Decimal('4.5'),
                    total_reviews=0
                )
                
                # Add specializations
                for spec_slug in data['specializations']:
                    spec = specializations.filter(slug=spec_slug).first()
                    if spec:
                        LawyerSpecializationMap.objects.create(
                            lawyer=lawyer_profile,
                            specialization=spec
                        )
                
                created_lawyers.append(data['full_name_en'])
                credentials.append({
                    'type': 'Lawyer',
                    'name': f"{data['full_name_en']} ({data['full_name_bn']})",
                    'email': data['email'],
                    'phone': data['phone'],
                    'password': data['password'],
                    'bar_council': data['bar_council']
                })
        except Exception as e:
            print(f"✗ Error creating lawyer {data['email']}: {str(e)}")
    
    if created_lawyers:
        print(f"✓ Created {len(created_lawyers)} lawyers: {', '.join(created_lawyers)}")
    else:
        print("✓ Lawyers already exist")


def main():
    print("\n" + "="*60)
    print("Adding Bengali Sample Data to Complete Legal Aid")
    print("="*60 + "\n")
    
    # Create specializations
    specializations = create_legal_specializations()
    
    # Create sample citizens
    create_sample_citizens()
    
    # Create sample lawyers
    create_sample_lawyers(specializations)
    
    print("\n" + "="*60)
    print("✓ Sample data added successfully!")
    print("="*60)
    
    if credentials:
        print("\n" + "="*60)
        print("CREDENTIALS (Save these!)")
        print("="*60 + "\n")
        
        for cred in credentials:
            print(f"{cred['type']}: {cred['name']}")
            print(f"  Email:    {cred['email']}")
            print(f"  Phone:    {cred['phone']}")
            print(f"  Password: {cred['password']}")
            if 'bar_council' in cred:
                print(f"  Bar No:   {cred['bar_council']}")
            print()
    
    return credentials


if __name__ == '__main__':
    credentials_list = main()
    
    # Save credentials to a file
    with open('sample_credentials.txt', 'w', encoding='utf-8') as f:
        f.write("="*60 + "\n")
        f.write("Complete Legal Aid - Sample User Credentials\n")
        f.write("="*60 + "\n\n")
        
        for cred in credentials_list:
            f.write(f"{cred['type']}: {cred['name']}\n")
            f.write(f"  Email:    {cred['email']}\n")
            f.write(f"  Phone:    {cred['phone']}\n")
            f.write(f"  Password: {cred['password']}\n")
            if 'bar_council' in cred:
                f.write(f"  Bar No:   {cred['bar_council']}\n")
            f.write("\n")
    
    print("✓ Credentials saved to: sample_credentials.txt")
