from setuptools import setup, find_packages

setup(
    name="social-assistance-system",
    version="0.1",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'Django>=4.2.0',
        'gunicorn>=20.1.0',
        # Other dependencies will be installed from requirements.txt
    ],
    python_requires='>=3.8',
)
